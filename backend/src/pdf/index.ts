import puppeteer from "puppeteer";
import uuidv4 from "uuid/v4";
import fs from "fs-extra";
import * as path from "path";

export async function htmlToPDF(filename: string): Promise<string> {
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
  await page.setContent("<div>Coucou !</div>");
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

  // Set timeout of 10 minutes to delete pdf
  setTimeout(() => {
    fs.unlinkSync(path.join(directory, `${filename}.pdf`));
    fs.rmdir(directory);
  }, 10 * 60 * 1000); // Minutes * Seconds * Milliseconds

  // Return url
  return `${id}/${filename}.pdf`;
}
