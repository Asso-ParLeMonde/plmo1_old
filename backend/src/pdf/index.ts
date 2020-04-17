import puppeteer from "puppeteer";
import uuidv4 from "uuid/v4";
import fs from "fs-extra";
import * as path from "path";
import pug from "pug";
import { logger } from "../utils/logger";
import { getBase64File, getQRCodeURL } from "../utils/utils";
import { Question } from "../entities/question";
import { getI18n } from "../translations";

const logoFont = getBase64File(path.join(__dirname, "templates/littledays.woff"));
const userLogo = getBase64File(path.join(__dirname, "templates/face.png"));

export enum PDF {
  PLAN_DE_TOURNAGE,
}
interface PDFMapping {
  [PDF.PLAN_DE_TOURNAGE]: {
    themeName: string;
    scenarioName: string;
    scenarioDescription: string;
    questions: Array<Question>;
    pseudo?: string;
    projectId: number | null;
    projectTitle: string | null;
  };
}
type PDFOptions<P extends PDF> = PDFMapping[P];

type pdfData = {
  filename: string;
  pugFile: string;
  args: pug.Options & pug.LocalsObject;
};
async function getTemplateData<P extends PDF>(pdf: P, options: PDFOptions<P>): Promise<pdfData | undefined> {
  if (pdf === PDF.PLAN_DE_TOURNAGE) {
    const QRCode = options.projectId === null ? "" : await getQRCodeURL(`https://par-le-monde-1.herokuapp.com/create/3-storyboard-and-filming-schedule?project=${options.projectId}`);
    return {
      pugFile: "plan_de_tournage.pug",
      filename: "Plan_de_tournage",
      args: { ...options, QRCode },
    };
  }
  return undefined;
}

export async function htmlToPDF<P extends PDF>(pdf: P, options: PDFOptions<P>, language: string = "fr"): Promise<string | undefined> {
  const templateData = await getTemplateData(pdf, options);
  if (templateData === undefined) {
    logger.info(`PDF ${pdf} not found!`);
    return undefined;
  }
  const t = await getI18n(language);
  if (t === null) {
    logger.info(`Could not load translations for PDF!`);
    return undefined;
  }
  const filename: string = templateData.filename;
  const html = pug.renderFile(path.join(__dirname, "templates", templateData.pugFile), { ...templateData.args, logoFont, userLogo, t });

  const id: string = uuidv4();
  const directory: string = path.join(__dirname, "../..", "dist/pdf/generated", id);
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
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate: "<div style='font-size:8px!important;color:grey!important;padding-right:1cm;text-align: right;width:100%;position: relative;' class='pdffooter'><span class='pageNumber'></span>/<span class='totalPages'></span></div>",
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
