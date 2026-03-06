import { readFile } from "fs/promises";

import handlebars from "handlebars";

export async function renderEmailTemplate(
  template: string,
  data?: Record<string, unknown>,
) {
  const templatePath = `${__dirname}/../views/emails/${template}.hbs`;
  const templateFile = await readFile(templatePath, "utf-8");
  const compiledTemplate = handlebars.compile(templateFile);
  return compiledTemplate(data);
}
