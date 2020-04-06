import fs from "fs-extra";
import * as path from "path";
import { parse } from "./po2json";
import compile from "./json2po";
import { translationObject } from "./util";
export { localesFR } from "./default";

export type LocaleFile = { [key: string]: string };

type SingleTranslation = {
  msgid: string;
  comments?: { [key: string]: string };
  msgid_plural?: string;
  msgstr: string[];
};

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
    };
    const pluralKey = `${key}_plural`;
    if (frenchTranslations[pluralKey]) {
      // eslint-disable-next-line
      singleTranslation.msgid_plural = frenchTranslations[pluralKey];
      singleTranslation.msgstr.push(translations[pluralKey] || "");
    }
    object.translations[""][singleTranslation.msgid] = singleTranslation;
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
  if (!object.translations[""]) {
    return translations;
  }
  const newTranslations = object.translations[""];

  for (const key of Object.keys(frenchTranslations)) {
    if (key.endsWith("_plural")) {
      continue;
    }

    if (newTranslations[frenchTranslations[key]] !== undefined) {
      const data: SingleTranslation = newTranslations[frenchTranslations[key]];
      translations[key] = data.msgstr[0] || "";
      if (data.msgid_plural) {
        translations[`${key}_plural`] = data.msgstr[1] || "";
      }
    }
  }

  return translations;
}
