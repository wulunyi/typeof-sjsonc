import { CstParser, Lexer } from "chevrotain";
import * as tokens from './lexer';

const SJsoncTokens = Object.values(tokens);
const SJsoncLexer = new Lexer(SJsoncTokens);

type ParserMethod = Parameters<CstParser['SUBRULE']>[0];

declare interface SJsoncParser {
  VariableDeclaration: ParserMethod;
  BlockComment: ParserMethod;
  LineComment: ParserMethod;
  Property: ParserMethod;
  Literal: ParserMethod;
  Array: ParserMethod;
  Object: ParserMethod;
  Program: ParserMethod;
  Comment: ParserMethod;
  value: ParserMethod;
  kind: ParserMethod;
}

class SJsoncParser extends CstParser {
  constructor() {
    super(SJsoncTokens);

    const $ = this;

    $.RULE("Program", () => {
      $.MANY(() => {
        $.OR([
          { ALT: () => $.SUBRULE($.Comment)},
          { ALT: () => $.SUBRULE($.VariableDeclaration)},
          { ALT: () => $.SUBRULE($.Object) },
          { ALT: () => $.SUBRULE($.Array) },
        ]);
      })
    });

    $.RULE('Comment', () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.BlockComment) },
        { ALT: () => $.CONSUME(tokens.LineComment) },
      ]);
    });

    $.RULE("VariableDeclaration", () => {
      $.OPTION(() => {
        $.SUBRULE($.kind);
      });
      $.CONSUME(tokens.Identifier);
      $.CONSUME(tokens.Equals);
      $.SUBRULE($.value);
      $.OPTION1(() => {
        $.CONSUME(tokens.Semicolon);
      })
    })

    $.RULE("Object", () => {
      $.CONSUME(tokens.LCurly);
      $.OPTION(() => {
        $.SUBRULE($.Property);
        $.MANY(() => {
          $.CONSUME(tokens.Comma);
          $.SUBRULE2($.Property);
        });
      });
      $.CONSUME(tokens.RCurly);
    });

    $.RULE("Property", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.StringLiteral) },
        { ALT: () => $.CONSUME(tokens.Identifier) },
      ]);
      $.CONSUME(tokens.Colon);
      $.SUBRULE($.value);
    });

    $.RULE("Array", () => {
      $.CONSUME(tokens.LSquare);
      $.OPTION(() => {
        $.SUBRULE($.value);
        $.MANY(() => {
          $.CONSUME(tokens.Comma);
          $.SUBRULE2($.value);
        });
      });
      $.CONSUME(tokens.RSquare);
    });

    $.RULE("kind", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokens.Const) },
        { ALT: () => $.CONSUME(tokens.Var) },
        { ALT: () => $.CONSUME(tokens.Let) },
      ])
    });

    $.RULE("value", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.Object) },
        { ALT: () => $.SUBRULE($.Array) },
        { ALT: () => $.CONSUME(tokens.StringLiteral) },
        { ALT: () => $.CONSUME(tokens.NumberLiteral) },
        { ALT: () => $.CONSUME(tokens.True) },
        { ALT: () => $.CONSUME(tokens.False) },
        { ALT: () => $.CONSUME(tokens.Null) },
      ]);
    });

    this.performSelfAnalysis();
  }
}

let parser: SJsoncParser;

export function parse(text: string) {
  if (parser === undefined) parser = new SJsoncParser();

  const lexResult = SJsoncLexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.Program();

  return {
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
}

const a = parse(`
// hello 
/** hello */
/**
 * hello world
 * */
var a = [1];
const b = 'hello'
let c = true
var d = null
var e = 
{
  "name": "xxx"
}
{
  "aaa": 1,
  'b': true
}
[]
`)

debugger;