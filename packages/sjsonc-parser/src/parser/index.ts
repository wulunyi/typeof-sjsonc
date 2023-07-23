import {
  Program,
  ObjectPattern,
  ObjectProperty,
  ValueType,
  ArrayPattern,
  Pattern,
  Comment,
  SourceLocation,
} from "./types";
import {
  createProgram,
  createObjectPattern,
  createIdentifier,
  createLiteral,
  createProperty,
  createArrayPattern,
  isNotUseToken,
  isColonToken,
  isRightBracketToken,
  isNotCloseBracket,
  isCommaToken,
  isRightBraceToken,
  isCommentToken,
  createLineComment,
  createBlockComment,
  isLineCommentToken,
  isBlockCommentToken,
  createSourceLocation,
  endLocation,
} from "./helper";
import { Lexer } from "../lexer";
import { head, last, isEmpty } from "lodash-es";

export function parse(code = ""): Program {
  const lexer = Lexer.create(code);
  const patterns: Pattern[] = [];
  const comments: Comment[] = [];

  const walk = () => {
    while (lexer.walk() !== undefined && isNotUseToken(lexer.current)) {}

    return lexer.current;
  };

  const collectComments = (token: moo.Token) => {
    if (isLineCommentToken(token)) {
      comments.push(createLineComment(token));
    } else if (isBlockCommentToken(token)) {
      comments.push(createBlockComment(token));
    }
  };

  const parseObject = (): ObjectPattern => {
    const object = createObjectPattern(createSourceLocation(lexer.current));

    while (isNotCloseBracket(walk())) {
      const token = lexer.current;

      if (token === undefined) {
        throw new Error("语法错误");
      }

      if (isCommentToken(token)) {
        collectComments(token);

        continue;
      }

      switch (token.type) {
        case "IDENTIFIER":
        case "STRING":
          object.children.push(parseProperty(token));
          break;
        default:
          throw new Error("语法错误");
      }

      if (isCommaToken(walk())) {
        continue;
      } else if (isCommentToken(lexer.current)) {
        collectComments(lexer.current);
        continue;
      } else if (isRightBraceToken(lexer.current)) {
        break;
      } else {
        throw new Error("语法错误");
      }
    }

    object.loc.end = endLocation(lexer.current);

    return object;
  };

  const parseProperty = (pToken: moo.Token): ObjectProperty => {
    const key = createIdentifier(
      pToken.value,
      pToken.text,
      createSourceLocation(pToken)
    );

    while (isCommentToken(walk())) {
      collectComments(lexer.current);
    }

    if (isColonToken(lexer.current)) {
      while (isCommentToken(walk())) {
        collectComments(lexer.current);
      }

      const value = parseValue(lexer.current);

      return createProperty(key, value, {
        start: key.loc.start,
        end: value.loc.end,
      });
    }

    throw new Error("语法错误");
  };

  const parseArray = (): ArrayPattern => {
    const array = createArrayPattern(createSourceLocation(lexer.current));

    while (!isRightBracketToken(walk())) {
      const token = lexer.current;

      if (token === undefined) {
        throw new Error("语法错误");
      }

      if (isCommentToken(token)) {
        collectComments(token);

        continue;
      }

      array.children.push(parseValue(token));

      if (isCommaToken(walk())) {
        continue;
      } else if (isCommentToken(lexer.current)) {
        collectComments(lexer.current);
        continue;
      } else if (isRightBracketToken(lexer.current)) {
        break;
      } else {
        throw new Error("语法错误");
      }
    }

    array.loc.end = endLocation(lexer.current);

    return array;
  };

  const parseValue = (token: moo.Token): ValueType => {
    let value: ValueType;

    switch (token.type) {
      case "STRING":
        value = createLiteral(
          token.value,
          token.text,
          createSourceLocation(token)
        );
        break;
      case "NUMBER":
        value = createLiteral(
          Number(token.value),
          token.text,
          createSourceLocation(token)
        );
        break;
      case "NULL":
        value = createLiteral(null, token.text, createSourceLocation(token));
        break;
      case "TRUE":
        value = createLiteral(true, token.text, createSourceLocation(token));
        break;
      case "FALSE":
        value = createLiteral(false, token.text, createSourceLocation(token));
        break;
      case "LEFT_BRACE":
        value = parseObject();
        break;
      case "LEFT_BRACKET":
        value = parseArray();
        break;
      default:
        throw new Error("语法错误");
    }

    return value;
  };

  while (walk() !== undefined) {
    const token = lexer.current;

    if (isCommentToken(token)) {
      collectComments(token);

      continue;
    }

    switch (token.type) {
      case "LEFT_BRACE":
        patterns.push(parseObject());
        break;
      case "LEFT_BRACKET":
        patterns.push(parseArray());
        break;
      default:
        throw new Error("语法错误");
    }
  }

  let loc: SourceLocation;

  if (isEmpty(patterns)) {
    loc = {
      start: {
        column: 0,
        line: 1,
      },
      end: {
        column: 0,
        line: 1,
      },
    };
  } else {
    loc = {
      start: head(patterns)!.loc.start,
      end: last(patterns)!.loc.end,
    };
  }

  return createProgram(loc, patterns, comments);
}
