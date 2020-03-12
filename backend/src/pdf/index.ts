import puppeteer from "puppeteer";
import uuidv4 from "uuid/v4";
import fs from "fs-extra";
import * as path from "path";
import pug from "pug";
import { logger } from "../utils/logger";

export enum Template {
  PLAN_DE_TOURNAGE,
}

function getTemplateName(template: Template): string | undefined {
  if (template === Template.PLAN_DE_TOURNAGE) {
    return "plan_de_tournage.pug";
  }
  return undefined;
}

export async function htmlToPDF(filename: string, template: Template): Promise<string | undefined> {
  const templateName = getTemplateName(template);
  if (templateName === undefined) {
    logger.info(`Template ${template} not found!`);
    return undefined;
  }
  const html = pug.renderFile(path.join(__dirname, "templates", templateName));

  const id: string = uuidv4();
  const directory: string = path.join(__dirname, "../..", "dist/pdf", id);
  await fs.mkdirs(directory);

  // Use puppeteer to generate PDF.
  const browserOptions: { args?: string[] } = {};
  if (process.env.DOCKER) {
    // Only for Docker
    browserOptions.args = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];
  }
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({
    path: path.join(directory, `${filename}.pdf`),
    format: "A4",
    margin: {
      top: "50px",
      right: "0px",
      bottom: "50px",
      left: "0px",
    },
    printBackground: true,
  });
  await browser.close();

  logger.info(`File ${filename}.pdf successfully generated!`);

  // Set timeout of 10 minutes to delete pdf
  setTimeout(() => {
    fs.unlinkSync(path.join(directory, `${filename}.pdf`));
    fs.rmdir(directory);
  }, 10 * 60 * 1000); // Minutes * Seconds * Milliseconds

  // Return url
  return `${id}/${filename}.pdf`;
}
