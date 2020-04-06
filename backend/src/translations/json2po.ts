/* eslint-disable */
import { translationObject, HEADERS, foldLine, compareMsgid, generateHeader } from "./util";
import { Buffer } from "safe-buffer";

/**
 * Exposes general compiler function. Takes a translation
 * object as a parameter and returns PO object
 *
 * @param  table Translation object
 * @return Compiled PO object
 */
export default (table: translationObject): Buffer => {
  const compiler = new Compiler(table);
  return compiler.compile();
};

/**
 * Creates a PO compiler object.
 *
 * @constructor
 * @param {Object} table Translation table to be compiled
 */
class Compiler {
  private table: translationObject;
  private options = {
    foldLength: 76,
    sort: true,
  };

  constructor(table: translationObject) {
    this.table = table;
    this.table.translations = this.table.translations || {};

    let { headers = {} } = this.table;

    headers = Object.keys(headers).reduce((result: any, key) => {
      const lowerKey = key.toLowerCase();

      if (HEADERS.has(lowerKey)) {
        result[(HEADERS as any).get(lowerKey)] = headers[key];
      } else {
        result[key] = headers[key];
      }

      return result;
    }, {});

    this.table.headers = headers;
  }

  /**
   * Converts a comments object to a comment string. The comment object is
   * in the form of {translator:'', reference: '', extracted: '', flag: '', previous:''}
   *
   * @param {Object} comments A comments object
   * @return {String} A comment string for the PO file
   */
  private drawComments(comments: { translator: Array<string>; extracted: Array<string>; reference: Array<string>; flag: Array<string>; previous: Array<string> }): string {
    const lines: Array<any> = [];
    const types = [
      {
        key: "translator",
        prefix: "# ",
      },
      {
        key: "reference",
        prefix: "#: ",
      },
      {
        key: "extracted",
        prefix: "#. ",
      },
      {
        key: "flag",
        prefix: "#, ",
      },
      {
        key: "previous",
        prefix: "#| ",
      },
    ];

    types.forEach(({ key, prefix }) => {
      if (!(comments as any)[key]) {
        return;
      }

      (comments as any)[key].split(/\r?\n|\r/).forEach((line: string) => {
        lines.push(`${prefix}${line}`);
      });
    });

    return lines.join("\n");
  }

  /**
   * Builds a PO string for a single translation object
   *
   * @param block Translation object
   * @param [override] Properties of this object will override `block` properties
   * @return Translation string for a single object
   */
  private drawBlock(block: any, override: any = {}): string {
    const response = [];
    const msgctxt = override.msgctxt || block.msgctxt;
    const msgid = override.msgid || block.msgid;
    const msgidPlural = override.msgid_plural || block.msgid_plural;
    const msgstr = [].concat(override.msgstr || block.msgstr);
    let comments = override.comments || block.comments;

    // add comments
    if (comments && (comments = this.drawComments(comments))) {
      response.push(comments);
    }

    if (msgctxt) {
      response.push(this.addPOString("msgctxt", msgctxt));
    }

    response.push(this.addPOString("msgid", msgid || ""));

    if (msgidPlural) {
      response.push(this.addPOString("msgid_plural", msgidPlural));

      msgstr.forEach((msgstr, i) => {
        response.push(this.addPOString(`msgstr[${i}]`, msgstr || ""));
      });
    } else {
      response.push(this.addPOString("msgstr", msgstr[0] || ""));
    }

    return response.join("\n");
  }

  /**
   * Escapes and joins a key and a value for the PO string
   *
   * @param key Key name
   * @param value Key value
   * @return Joined and escaped key-value pair
   */
  private addPOString(key: string = "", value: string = ""): string {
    key = key.toString();

    // escape newlines and quotes
    value = value
      .toString()
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r")
      .replace(/\n/g, "\\n");

    let lines = [value];

    if (this.options.foldLength > 0) {
      lines = foldLine(value, this.options.foldLength);
    }

    if (lines.length < 2) {
      return `${key} "${lines.shift() || ""}"`;
    }

    return `${key} ""\n"${lines.join('"\n"')}"`;
  }

  /**
   * Compiles translation object into a PO object
   *
   * @return Compiled PO object
   */
  public compile(): Buffer {
    const headerBlock = (this.table.translations[""] && this.table.translations[""][""]) || {};
    let response: Array<any> = [];

    Object.keys(this.table.translations).forEach(msgctxt => {
      if (typeof this.table.translations[msgctxt] !== "object") {
        return;
      }

      Object.keys(this.table.translations[msgctxt]).forEach(msgid => {
        if (typeof this.table.translations[msgctxt][msgid] !== "object") {
          return;
        }

        if (msgctxt === "" && msgid === "") {
          return;
        }

        response.push(this.table.translations[msgctxt][msgid]);
      });
    });

    if (this.options.sort !== false) {
      if (typeof this.options.sort === "function") {
        response = response.sort(this.options.sort);
      } else {
        response = response.sort(compareMsgid);
      }
    }

    response = response.map(r => this.drawBlock(r));

    response.unshift(
      this.drawBlock(headerBlock, {
        msgstr: generateHeader(this.table.headers),
      }),
    );

    return Buffer.from(response.join("\n\n"), "utf-8");
  }
}
