// see https://www.gnu.org/software/gettext/manual/html_node/Header-Entry.html
export const HEADERS = new Map([
  ["project-id-version", "Project-Id-Version"],
  ["report-msgid-bugs-to", "Report-Msgid-Bugs-To"],
  ["pot-creation-date", "POT-Creation-Date"],
  ["po-revision-date", "PO-Revision-Date"],
  ["last-translator", "Last-Translator"],
  ["language-team", "Language-Team"],
  ["language", "Language"],
  ["content-type", "Content-Type"],
  ["content-transfer-encoding", "Content-Transfer-Encoding"],
  ["plural-forms", "Plural-Forms"],
]);

export type translationObject = {
  charset: string;
  headers: undefined | { [key: string]: string };
  translations: {
    [key: string]: {
      [key: string]: {
        msgid: string;
        comments?: { [key: string]: string };
        msgid_plural?: string;
        msgstr: string[];
      };
    };
  };
};

/**
 * Parses a header string into an object of key-value pairs
 *
 * @param str Header string
 * @returns header object of key value pairs
 */
export function parseHeader(str = ""): { [key: string]: string } {
  return str.split("\n").reduce((headers: { [key: string]: string }, line) => {
    const parts = line.split(":");
    let key = (parts.shift() || "").trim();

    if (key) {
      const value = parts.join(":").trim();

      key = HEADERS.get(key.toLowerCase()) || key;

      headers[key] = value;
    }

    return headers;
  }, {});
}

/**
 * Joins a header object of key value pairs into a header string
 *
 * @param header Object of key value pairs
 * @return Header string
 */
export function generateHeader(header: { [key: string]: string } = {}): string {
  const keys = Object.keys(header).filter(key => !!key);

  if (!keys.length) {
    return "";
  }

  return `${keys.map(key => `${key}: ${(header[key] || "").trim()}`).join("\n")}\n`;
}

/**
 * Normalizes charset name. Converts utf8 to utf-8, WIN1257 to windows-1257 etc.
 *
 * @param charset Charset name
 * @return Normalized charset name
 */
export function formatCharset(charset: string = "iso-8859-1", defaultCharset: string = "iso-8859-1"): string {
  return charset
    .toString()
    .toLowerCase()
    .replace(/^utf[-_]?(\d+)$/, "utf-$1")
    .replace(/^win(?:dows)?[-_]?(\d+)$/, "windows-$1")
    .replace(/^latin[-_]?(\d+)$/, "iso-8859-$1")
    .replace(/^(us[-_]?)?ascii$/, "ascii")
    .replace(/^charset$/, defaultCharset)
    .trim();
}

/**
 * Folds long lines according to PO format
 *
 * @param str PO formatted string to be folded
 * @param [maxLen=76] Maximum allowed length for folded lines
 * @return An array of lines
 */
export function foldLine(str: string, maxLen: number = 76): string[] {
  const lines = [];
  const len = str.length;
  let curLine = "";
  let pos = 0;
  let match: RegExpExecArray | null;

  while (pos < len) {
    curLine = str.substr(pos, maxLen);

    // ensure that the line never ends with a partial escaping
    // make longer lines if needed
    while (curLine.substr(-1) === "\\" && pos + curLine.length < len) {
      curLine += str.charAt(pos + curLine.length);
    }

    // ensure that if possible, line breaks are done at reasonable places
    if ((match = /.*?\\n/.exec(curLine))) {
      // use everything before and including the first line break
      curLine = match[0];
    } else if (pos + curLine.length < len) {
      // if we're not at the end
      if ((match = /.*\s+/.exec(curLine)) && /[^\s]/.test(match[0])) {
        // use everything before and including the last white space character (if anything)
        curLine = match[0];
      } else if ((match = /.*[\x21-\x2f0-9\x5b-\x60\x7b-\x7e]+/.exec(curLine)) && /[^\x21-\x2f0-9\x5b-\x60\x7b-\x7e]/.test(match[0])) {
        // use everything before and including the last "special" character (if anything)
        curLine = match[0];
      }
    }

    lines.push(curLine);
    pos += curLine.length;
  }

  return lines;
}

/**
 * Comparator function for comparing msgid
 * @param object with msgid prev
 * @param object with msgid next
 * @returns comparator index
 */
export function compareMsgid({ msgid: left }: { msgid: string }, { msgid: right }: { msgid: string }): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}
