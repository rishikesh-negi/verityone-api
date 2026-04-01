import { readFile } from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function renderEmailTemplate(template: string, data?: Record<string, unknown>) {
  const templatePath = `${__dirname}/../views/emails/templates/${template}.hbs`;
  const templateFile = await readFile(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateFile);
  return compiledTemplate(data);
}
