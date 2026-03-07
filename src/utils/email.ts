import htmlToText from "html-to-text";
import type { HydratedDocument } from "mongoose";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import type SMTPPool from "nodemailer/lib/smtp-pool/index.js";
import type { IEmployee } from "../models/employeeModel.js";
import type { IOrganization } from "../models/organizationModel.js";
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
  readonly url: string;
  readonly from: string;

  constructor(user: HydratedDocument<IEmployee | IOrganization>, url: string) {
    this.to = user?.email;
    this.name = "firstName" in user ? user.firstName : user.name;
    this.url = url;
    this.from = `Beatific Team <${process.env["EMAIL_FROM"]}>`;
  }

  newTransport() {
    const transporter =
      process.env["NODE_ENV"] === "production"
        ? nodemailer.createTransport(transportOptions)
        : nodemailer.createTransport(transportOptions);

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

  async send(
    template: string,
    subject: string,
    data?: Record<string, unknown>,
  ) {
    const html = await renderEmailTemplate(template, data);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {
        wordwrap: false,
      }),
    };

    await this.newTransport().sendMail(mailOptions);
  }
}
