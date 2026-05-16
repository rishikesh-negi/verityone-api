import htmlToText from "html-to-text";
import type { HydratedDocument } from "mongoose";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import juice from "juice";
import type SMTPPool from "nodemailer/lib/smtp-pool/index.js";
import type { IEmployee } from "../models/employeeModel.js";
import type { IWorkplace } from "../models/workplaceModel.js";
import { renderEmailTemplate } from "./renderEmailTemplate.js";
import path from "node:path";

const transportOptions: SMTPPool.Options =
  process.env["NODE_ENV"] === "production"
    ? {
        service: "Brevo",
        host: process.env["BREVO_HOST"],
        port: +process.env["PORT"]!,
        pool: true,
        auth: {
          user: process.env["BREVO_LOGIN"],
          pass: process.env["BREVO_PASSWORD"],
        },
      }
    : {
        host: process.env["EMAIL_HOST"],
        port: +process.env["EMAIL_PORT"]!,
        pool: true,
        auth: {
          user: process.env["EMAIL_USERNAME"],
          pass: process.env["EMAIL_PASSWORD"],
        },
      };

export default class Email {
  readonly to: string;
  readonly name?: string;
  readonly url?: string;
  readonly from: string;
  #userType: "employee" | "workplace";

  static #newTransport() {
    const transporter = nodemailer.createTransport(transportOptions);

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          layoutsDir: path.resolve("../views/emails/layouts"),
          partialsDir: path.resolve("../views/emails/partials"),
          defaultLayout: "main",
        },
        viewPath: path.resolve("../views/emails/templates"),
        extName: ".hbs",
      }),
    );

    return transporter;
  }

  constructor(user: HydratedDocument<IEmployee | IWorkplace>, url?: string) {
    this.to = user?.email;
    this.#userType = "firstName" in user ? "employee" : "workplace";
    this.name = "firstName" in user ? user.firstName : user.organizationName;
    if (url) this.url = url;
    this.from = `VerityOne Team <${process.env["EMAIL_FROM"]}>`;
  }

  async send(template: string, subject: string, data?: Record<string, unknown>) {
    const unstyledHtml = await renderEmailTemplate(template, data);
    const html = juice(unstyledHtml);

    await Email.#newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {
        wordwrap: false,
      }),
    });
  }

  async sendWelcome() {
    const subject = "Welcome to VerityOne. Verify your email address.";
    const template = this.#userType === "employee" ? "welcomeEmployee" : "welcomeWorkplace";

    await this.send(template, subject, {
      subject,
      userEmail: this.to,
      currentYear: new Date().getFullYear(),
      name: this.name,
      url: this.url,
    });
  }
}
