/* eslint-disable */
import { parseHeader, translationObject } from "./util";

type commentKey = "translator" | "extracted" | "reference" | "flag" | "previous";

/**
 * Parses a PO object into translation table
 *
 * @param buffer PO object
 * @param defaultCharset Default charset to use
 * @return Translation object
 */
export function parse(buffer: Buffer | string): translationObject {
  const parser = new Parser(buffer);

  return parser.parse();
}

/**
 * Creates a PO parser object. If PO object is a string,
 * UTF-8 will be used as the charset
 *
 * @constructor
 * @param {Buffer|String} fileContents PO object
 * @param {String} [defaultCharset] Default charset to use
 */
class Parser {
  private fileContents: string;
  private charset: string;
  private lex: Array<any>;
  private escaped: boolean;
  private node: any;
  private state: any;
  private lineNumber: number;

  private symbols = {
    quotes: /["']/,
    comments: /#/,
    whitespace: /\s/,
    key: /[\w\-[\]]/,
    keyNames: /^(?:msgctxt|msgid(?:_plural)?|msgstr(?:\[\d+])?)$/,
  };

  /**
   * State constants for parsing FSM
   */
  private states = {
    none: 0x01,
    comments: 0x02,
    key: 0x03,
    string: 0x04,
  };

  /**
   * Value types for lexer
   */
  private types = {
    comments: 0x01,
    key: 0x02,
    string: 0x03,
  };

  constructor(fileContents: Buffer | string) {
    this.charset = "utf-8";
    this.lex = [];
    this.escaped = false;
    this.node = {};
    this.state = this.states.none;
    this.lineNumber = 1;

    if (typeof fileContents === "string") {
      this.fileContents = fileContents;
    } else {
      this.fileContents = fileContents.toString();
    }
  }

  /**
   * Parses the PO object and returns translation table
   *
   * @return Translation table
   */
  parse(): translationObject {
    this.lexer(this.fileContents);
    return this.finalize(this.lex);
  }

  /**
   * Token parser. Parsed state can be found from this.lex
   *
   * @param chunk String
   */
  lexer(chunk: string): void {
    let chr: string;

    for (let i = 0, len = chunk.length; i < len; i++) {
      chr = chunk.charAt(i);

      if (chr === "\n") {
        this.lineNumber += 1;
      }

      switch (this.state) {
        case this.states.none:
          if (chr.match(this.symbols.quotes)) {
            this.node = {
              type: this.types.string,
              value: "",
              quote: chr,
            };
            this.lex.push(this.node);
            this.state = this.states.string;
          } else if (chr.match(this.symbols.comments)) {
            this.node = {
              type: this.types.comments,
              value: "",
            };
            this.lex.push(this.node);
            this.state = this.states.comments;
          } else if (!chr.match(this.symbols.whitespace)) {
            this.node = {
              type: this.types.key,
              value: chr,
            };
            this.lex.push(this.node);
            this.state = this.states.key;
          }
          break;
        case this.states.comments:
          if (chr === "\n") {
            this.state = this.states.none;
          } else if (chr !== "\r") {
            this.node.value += chr;
          }
          break;
        case this.states.string:
          if (this.escaped) {
            switch (chr) {
              case "t":
                this.node.value += "\t";
                break;
              case "n":
                this.node.value += "\n";
                break;
              case "r":
                this.node.value += "\r";
                break;
              default:
                this.node.value += chr;
            }
            this.escaped = false;
          } else {
            if (chr === this.node.quote) {
              this.state = this.states.none;
            } else if (chr === "\\") {
              this.escaped = true;
              break;
            } else {
              this.node.value += chr;
            }
            this.escaped = false;
          }
          break;
        case this.states.key:
          if (!chr.match(this.symbols.key)) {
            if (!this.node.value.match(this.symbols.keyNames)) {
              const err = new SyntaxError(`Error parsing PO data: Invalid key name "${this.node.value}" at line ${this.lineNumber}. This can be caused by an unescaped quote character in a msgid or msgstr value.`);

              // err.lineNumber = this.lineNumber;

              throw err;
            }
            this.state = this.states.none;
            i--;
          } else {
            this.node.value += chr;
          }
          break;
      }
    }
  }

  /**
   * Join multi line strings
   *
   * @param tokens Parsed tokens
   * @return Parsed tokens, with multi line strings joined into one
   */
  joinStringValues(tokens: any): any {
    const response = [];
    let lastNode: any;

    for (let i = 0, len = tokens.length; i < len; i++) {
      if (lastNode && tokens[i].type === this.types.string && lastNode.type === this.types.string) {
        lastNode.value += tokens[i].value;
      } else if (lastNode && tokens[i].type === this.types.comments && lastNode.type === this.types.comments) {
        lastNode.value += `\n${tokens[i].value}`;
      } else {
        response.push(tokens[i]);
        lastNode = tokens[i];
      }
    }

    return response;
  }

  /**
   * Parse comments into separate comment blocks
   *
   * @param tokens Parsed tokens
   */
  parseComments(tokens: any): void {
    // parse comments
    tokens.forEach((node: any) => {
      let comment: {
        translator: Array<string>;
        extracted: Array<string>;
        reference: Array<string>;
        flag: Array<string>;
        previous: Array<string>;
      };
      let lines: Array<string>;

      if (node && node.type === this.types.comments) {
        comment = {
          translator: [],
          extracted: [],
          reference: [],
          flag: [],
          previous: [],
        };

        lines = (node.value || "").split(/\n/);

        lines.forEach(line => {
          switch (line.charAt(0) || "") {
            case ":":
              comment.reference.push(line.substr(1).trim());
              break;
            case ".":
              comment.extracted.push(line.substr(1).replace(/^\s+/, ""));
              break;
            case ",":
              comment.flag.push(line.substr(1).replace(/^\s+/, ""));
              break;
            case "|":
              comment.previous.push(line.substr(1).replace(/^\s+/, ""));
              break;
            default:
              comment.translator.push(line.replace(/^\s+/, ""));
          }
        });

        node.value = {};

        Object.keys(comment).forEach((key: string) => {
          if (comment[key as commentKey] && comment[key as commentKey].length) {
            node.value[key as commentKey] = comment[key as commentKey].join("\n");
          }
        });
      }
    });
  }

  /**
   * Join gettext keys with values
   *
   * @param tokens Parsed tokens
   * @return Tokens
   */
  handleKeys(tokens: any): any {
    const response = [];
    let lastNode: any;

    for (let i = 0, len = tokens.length; i < len; i++) {
      if (tokens[i].type === this.types.key) {
        lastNode = {
          key: tokens[i].value,
        };
        if (i && tokens[i - 1].type === this.types.comments) {
          lastNode.comments = tokens[i - 1].value;
        }
        lastNode.value = "";
        response.push(lastNode);
      } else if (tokens[i].type === this.types.string && lastNode) {
        lastNode.value += tokens[i].value;
      }
    }

    return response;
  }

  /**
   * Separate different values into individual translation objects
   *
   * @param tokens Parsed tokens
   * @return Tokens
   */
  handleValues(tokens: any): any {
    const response = [];
    let lastNode: any;
    let curContext: any;
    let curComments: any;

    for (let i = 0, len = tokens.length; i < len; i++) {
      if (tokens[i].key.toLowerCase() === "msgctxt") {
        curContext = tokens[i].value;
        curComments = tokens[i].comments;
      } else if (tokens[i].key.toLowerCase() === "msgid") {
        lastNode = {
          msgid: tokens[i].value,
        };

        if (curContext) {
          lastNode.msgctxt = curContext;
        }

        if (curComments) {
          lastNode.comments = curComments;
        }

        if (tokens[i].comments && !lastNode.comments) {
          lastNode.comments = tokens[i].comments;
        }

        curContext = false;
        curComments = false;
        response.push(lastNode);
      } else if (tokens[i].key.toLowerCase() === "msgid_plural") {
        if (lastNode) {
          lastNode.msgid_plural = tokens[i].value;
        }

        if (tokens[i].comments && !lastNode.comments) {
          lastNode.comments = tokens[i].comments;
        }

        curContext = false;
        curComments = false;
      } else if (tokens[i].key.substr(0, 6).toLowerCase() === "msgstr") {
        if (lastNode) {
          lastNode.msgstr = (lastNode.msgstr || []).concat(tokens[i].value);
        }

        if (tokens[i].comments && !lastNode.comments) {
          lastNode.comments = tokens[i].comments;
        }

        curContext = false;
        curComments = false;
      }
    }

    return response;
  }

  /**
   * Compose a translation table from tokens object
   *
   * @param tokens Parsed tokens
   * @return Translation table
   */
  normalize(tokens: any): translationObject {
    const table: translationObject = {
      charset: this.charset,
      headers: undefined,
      translations: {},
    };
    let msgctxt: string;

    for (let i = 0, len = tokens.length; i < len; i++) {
      msgctxt = tokens[i].msgctxt || "";

      if (!table.translations[msgctxt]) {
        table.translations[msgctxt] = {};
      }

      if (!table.headers && !msgctxt && !tokens[i].msgid) {
        table.headers = parseHeader(tokens[i].msgstr[0]);
      }

      table.translations[msgctxt][tokens[i].msgid] = tokens[i];
    }

    return table;
  }

  /**
   * Converts parsed tokens to a translation table
   *
   * @param tokens Parsed tokens
   * @returns Translation table
   */
  finalize(tokens: any): translationObject {
    let data = this.joinStringValues(tokens);

    this.parseComments(data);

    data = this.handleKeys(data);
    data = this.handleValues(data);

    return this.normalize(data);
  }
}
