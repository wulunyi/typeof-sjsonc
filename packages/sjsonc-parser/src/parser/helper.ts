import {
  Program,
  ObjectPattern,
  ObjectProperty,
  Identifier,
  ValueType,
  ArrayPattern,
  BaseType,
  Literal,
  SourceLocation,
  LineComment,
  BlockComment,
  Pattern,
  Location,
  Comment,
} from "./types";
import { last, add, subtract } from "lodash-es";
import * as moo from "moo";

export function createProgram(
  loc: SourceLocation,
  body: Pattern[],
  comments: Comment[]
): Program {
  return {
    type: "Program",
    start: loc.start.column,
    end: loc.end.column,
    loc,
    body,
    comments,
  };
}

export function createObjectPattern(
  loc: SourceLocation,
  children: ObjectProperty[] = []
): ObjectPattern {
  return {
    type: "ObjectPattern",
    children,
    loc,
  };
}

export function createProperty(
  key: Identifier,
  value: ValueType,
  loc: SourceLocation
): ObjectProperty {
  return {
    type: "ObjectProperty",
    key,
    value,
    loc,
  };
}

export function createIdentifier(
  value: string,
  raw: string,
  loc: SourceLocation
): Identifier {
  return {
    type: "Identifier",
    value,
    raw,
    loc,
  };
}

export function createArrayPattern(
  loc: SourceLocation,
  children: ValueType[] = []
): ArrayPattern {
  return {
    type: "ArrayPattern",
    children,
    loc,
  };
}

export function createLiteral(
  value: BaseType,
  raw: string,
  loc: SourceLocation
): Literal {
  return {
    type: "Literal",
    value,
    raw,
    loc,
  };
}

export function createLineComment(token: moo.Token): LineComment {
  return {
    type: "LineComment",
    value: token.value,
    raw: token.text,
    loc: createSourceLocation(token),
  };
}

export function createBlockComment(token: moo.Token): BlockComment {
  return {
    type: "BlockComment",
    value: token.value.split("\n"),
    raw: token.text,
    loc: createSourceLocation(token),
  };
}

const addSubtract1 = (a: number, b: number) => subtract(add(a, b), 1);

const equalOne = (a: number) => a === 1;

export function startLocation(token: moo.Token): Location {
  return {
    column: token.col,
    line: token.line,
  };
}

export function endLocation(token: moo.Token): Location {
  const arr = token.text.split("\n");
  const len = arr.length;
  const lastStrLen = last(arr)!.length;

  return {
    line: add(token.line, token.lineBreaks),
    column: equalOne(len) ? addSubtract1(lastStrLen, token.col) : lastStrLen,
  };
}

export function createSourceLocation(token: moo.Token): SourceLocation {
  return {
    start: startLocation(token),
    end: endLocation(token),
  };
}

export function isNotUseToken(token: moo.Token) {
  return token.type === "LINE_BREAK" || token.type === "WHITE_SPACE";
}

export function isRightBraceToken(token?: moo.Token) {
  return token && token.type === "RIGHT_BRACE";
}

export function isRightBracketToken(token?: moo.Token) {
  return token && token.type === "RIGHT_BRACKET";
}

export function isColonToken(token?: moo.Token) {
  return token && token.type === "COLON";
}

export const isNotCloseBracket = (token: moo.Token) =>  !isRightBraceToken(token);

export function isCommaToken(token?: moo.Token) {
  return token && token.type === "COMMA";
}

export function isLineCommentToken(token?: moo.Token) {
  return token && token.type  === "LINE_COMMENT";
}

export function isBlockCommentToken(token?: moo.Token) {
  return token && token.type === "BLOCK_COMMENT";
}

export function isCommentToken(token?: moo.Token) {
  return token && (isLineCommentToken(token) || isBlockCommentToken(token));
}
