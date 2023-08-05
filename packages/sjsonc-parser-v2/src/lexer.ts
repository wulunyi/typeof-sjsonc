import { Lexer, createToken } from "chevrotain";

export const True = createToken({ name: "True", pattern: /true/ });
export const Const = createToken({ name: 'Const', pattern: /const/ });
export const Var = createToken({ name: 'Var', pattern: /var/ });
export const Let = createToken({ name: 'let', pattern: /let/ });
export const False = createToken({ name: "False", pattern: /false/ });
export const Null = createToken({ name: "Null", pattern: /null/ });
export const LCurly = createToken({ name: "LCurly", pattern: /{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /}/ });
export const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
export const RSquare = createToken({ name: "RSquare", pattern: /]/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Equals = createToken({ name: 'Equals', pattern: /=/ });
export const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ });
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n]*/,
});
export const BlockComment = createToken({
  name: "BlockComment",
  pattern: /\/\*[\s\S]*?\*\//,
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /("|')(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*?\1/,
});
export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
});
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});