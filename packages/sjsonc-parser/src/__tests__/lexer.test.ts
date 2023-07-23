import { Lexer } from "../lexer";

describe("Tokenizer", () => {
  it("Tokenizer.create", () => {
    const tokenizer = Lexer.create("{}");
    expect(tokenizer).toBeInstanceOf(Lexer);
    expect(tokenizer).toHaveProperty("walk");
    expect(tokenizer).toHaveProperty("current");
  });

  it("scanner object", () => {
    const tokenizer = Lexer.create("{}");
    expect(tokenizer.walk()).toHaveProperty("type", "LEFT_BRACE");
    expect(tokenizer.walk()).toHaveProperty("type", "RIGHT_BRACE");
    expect(tokenizer.walk()).toBe(undefined);
    expect(tokenizer.walk()).toBe(undefined);
  });

  it("scanner array", () => {
    const tokenizer = Lexer.create("[]");
    expect(tokenizer.walk()).toHaveProperty("type", "LEFT_BRACKET");
    expect(tokenizer.walk()).toHaveProperty("type", "RIGHT_BRACKET");
  });

  it("scanner comma", () => {
    const tokenizer = Lexer.create(`,`);
    expect(tokenizer.walk()).toHaveProperty("type", "COMMA");
  });

  it("scanner colon", () => {
    const tokenizer = Lexer.create(`:`);
    expect(tokenizer.walk()).toHaveProperty("type", "COLON");
  });

  it("scanner string", () => {
    const tokenizer = Lexer.create(`"aaaa"`);
    expect(tokenizer.walk()).toHaveProperty("type", "STRING");
    expect(tokenizer.current).toHaveProperty("value", "aaaa");
    expect(tokenizer.current).toHaveProperty("text", '"aaaa"');
    const tokenizer1 = Lexer.create(`'aaaa'`);
    expect(tokenizer1.walk()).toHaveProperty("type", "STRING");
    expect(tokenizer1.current).toHaveProperty("value", "aaaa");
    expect(tokenizer1.current).toHaveProperty("text", "'aaaa'");
  });

  it("scanner NumericLiteral", () => {
    const tokenizer = Lexer.create(`0 1 1.1 -1 -0.1 -1.1 0.1`);
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "0");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "1");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "1.1");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "-1");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "-0.1");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "-1.1");
    tokenizer.walk();
    expect(tokenizer.walk()).toHaveProperty("type", "NUMBER");
    expect(tokenizer.current).toHaveProperty("value", "0.1");
  });

  it("scanner IDENTIFIER", () => {
    const tokenizer = Lexer.create(`aaa true null false _aaa aaaAaaa aaa_aaa`);
    expect(tokenizer.walk()).toHaveProperty("type", "IDENTIFIER");
    expect(tokenizer.current).toHaveProperty("value", "aaa");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "TRUE");
    expect(tokenizer.current).toHaveProperty("value", "true");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "NULL");
    expect(tokenizer.current).toHaveProperty("value", "null");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "FALSE");
    expect(tokenizer.current).toHaveProperty("value", "false");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "IDENTIFIER");
    expect(tokenizer.current).toHaveProperty("value", "_aaa");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "IDENTIFIER");
    expect(tokenizer.current).toHaveProperty("value", "aaaAaaa");
    expect(tokenizer.walk()).toHaveProperty("type", "WHITE_SPACE");
    expect(tokenizer.walk()).toHaveProperty("type", "IDENTIFIER");
    expect(tokenizer.current).toHaveProperty("value", "aaa_aaa");
  });

  it("scanner LineComment", () => {
    const tokenizer = Lexer.create(`// comment`);
    expect(tokenizer.walk()).toHaveProperty("type", "LINE_COMMENT");
    expect(tokenizer.current).toHaveProperty("value", "comment");
  });

  it("scanner BlockComment", () => {
    const tokenizer = Lexer.create(`/** comment *//** aaa \n *  b */aa`);
    expect(tokenizer.walk()).toHaveProperty("type", "BLOCK_COMMENT");
    expect(tokenizer.current).toHaveProperty("value", "comment");
    expect(tokenizer.walk()).toHaveProperty("type", "BLOCK_COMMENT");
    expect(tokenizer.current).toHaveProperty("value", "aaa\nb");
    expect(tokenizer.current.lineBreaks).toBe(1);
    expect(tokenizer.walk()).toHaveProperty("type", "IDENTIFIER");
    expect(tokenizer.current.line).toBe(2);
  });
});
