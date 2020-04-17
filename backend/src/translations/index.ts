import fs from "fs-extra";
import * as path from "path";
import i18next, { TFunction } from "i18next";
import { parse } from "./po2json";
import compile from "./json2po";
import { translationObject, SingleTranslation } from "./util";
import { downloadFile } from "../fileUpload";
import { defaultLocales } from "./defaultLocales";
export { defaultLocales } from "./defaultLocales";

export type LocaleFile = { [key: string]: string };

export async function translationsToFile(language: string, translations: LocaleFile, frenchTranslations: LocaleFile): Promise<string> {
  const object: translationObject = {
    charset: "utf-8",
    headers: {
      "Project-Id-Version": "par-le-monde-1",
      "Report-Msgid-Bugs-To": "",
      "POT-Creation-Date": new Date().toISOString(),
      "PO-Revision-Date": new Date().toISOString(),
      "Language-Team": "French",
      "Plural-Forms": "nplurals=2; plural=(n != 1);",
      "MIME-Version": "1.0",
      "Content-Type": "text/plain; charset=UTF-8",
      "Content-Transfer-Encoding": "8bit",
      "X-Loco-Source-Locale": "fr",
      "X-Generator": "",
      "Last-Translator": "",
      Language: language,
    },
    translations: {
      "": {},
    },
  };

  for (const key of Object.keys(frenchTranslations)) {
    if (key.endsWith("_plural")) {
      continue;
    }

    const singleTranslation: SingleTranslation = {
      msgid: frenchTranslations[key],
      msgstr: [translations[key] || ""],
      msgctxt: key,
    };
    const pluralKey = `${key}_plural`;
    if (frenchTranslations[pluralKey]) {
      // eslint-disable-next-line
      singleTranslation.msgid_plural = frenchTranslations[pluralKey];
      singleTranslation.msgstr.push(translations[pluralKey] || "");
    }
    object.translations[key] = {};
    object.translations[key][singleTranslation.msgid] = singleTranslation;
  }

  const directory: string = path.join(__dirname, "../..", "dist/locales");
  await fs.mkdirs(directory);
  await new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, "../..", "dist/locales", `${language}.po`), compile(object), err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  return `locales/${language}.po`;
}

export function fileToTranslations(filebuffer: Buffer, frenchTranslations: LocaleFile): LocaleFile {
  const object: translationObject = parse(filebuffer);
  const translations: LocaleFile = {};
  const newTranslations = object.translations;

  for (const key of Object.keys(frenchTranslations)) {
    if (key.endsWith("_plural")) {
      continue;
    }

    if (newTranslations[key] !== undefined && newTranslations[key][frenchTranslations[key]] !== undefined) {
      const data: SingleTranslation = newTranslations[key][frenchTranslations[key]];
      if ((data.msgstr[0] || "").length === 0) {
        continue;
      }

      translations[key] = data.msgstr[0] || "";
      if (data.msgid_plural) {
        translations[`${key}_plural`] = data.msgstr[1] || "";
      }
    }
  }

  return translations;
}

export async function getI18n(language: string): Promise<TFunction | null> {
  const JSONlanguageBuffer: Buffer | null = await downloadFile(`locales/${language}.json`);
  const locales = JSONlanguageBuffer !== null ? JSON.parse(JSONlanguageBuffer.toString()) : {};

  try {
    const t = await i18next.init({
      lng: "default",
      debug: false,
      resources: {
        default: {
          translation: {
            ...defaultLocales,
            ...locales,
          },
        },
      },
    });

    return t;
  } catch {
    return null;
  }
}
