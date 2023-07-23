import * as moo from "moo";
import {
  slice,
  trim,
  split,
  map,
  replace,
  filter,
  join,
  isEmpty,
} from "lodash-es";

/**
 * 从 'aa' 或者 "aa" 字符串中提取 aa 字符
 */
const pickStrValue = (s: string) => s.slice(1, -1);

/**
 * 获取行级注释文本
 */
const pickLineCommentValue = (s: string) =>  trim(s.slice(2));

/**
 * 获取块级注释的文本数组
 */
const pickBlockCommentValue = (s: string) => {
  return s.slice(2, -2)
    .split(/\n/)
    .map((item) => trim(replace(item, /\*+/, "")))
    .filter((item) => !isEmpty(item))
    .join('\n');
}

const lexer = moo.compile({
  LEFT_BRACE: "{", // {
  RIGHT_BRACE: "}", // }
  LEFT_BRACKET: "[", // [
  RIGHT_BRACKET: "]", // ]
  COLON: ":", // :
  COMMA: ",", // ,
  STRING: [
    {
      match: /"(?:\\["\\]|[^\n"\\])*"/,
      value: pickStrValue,
    },
    {
      match: /'(?:\\['\\]|[^\n'\\])*?'/,
      value: pickStrValue,
    },
  ],
  NUMBER: [
    { match: /0\.\d*/ },
    { match: /0{1}/ },
    { match: /[1-9]\d*\.?\d*/ },
    { match: /\-[0-9]\d*\.?\d*/ },
  ],
  IDENTIFIER: {
    match: /[a-zA-Z_][a-zA-Z0-9_]*/,
    type: moo.keywords({
      NULL: "null",
      TRUE: "true",
      FALSE: "false",
    }),
  },
  BLOCK_COMMENT: {
    match: /\/\*[\s\S]*?\*\//,
    value: pickBlockCommentValue,
    lineBreaks: true,
  },
  LINE_COMMENT: {
    match: /\/\/[^\n]*/,
    value: pickLineCommentValue,
  },
  LINE_BREAK: { match: /\n/, lineBreaks: true },
  WHITE_SPACE: { match: /\s+/, lineBreaks: true },
});

export class Lexer {
  static create(code: string) {
    return new this(code);
  }

  tokens: moo.Token[] = [];
  pos = -1;

  get current() {
    return this.tokens[this.pos];
  }

  constructor(readonly code: string) {
    lexer.reset(code);

    this.tokens = Array.from(lexer);
  }

  walk() {
    if (this.pos === -1 || this.tokens[this.pos]) {
      return this.tokens[++this.pos];
    }

    return this.tokens[this.pos];
  }
}
