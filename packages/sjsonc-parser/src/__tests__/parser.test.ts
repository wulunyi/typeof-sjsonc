import { parse } from "../parser";

describe("Test Parser", () => {
  it("Test ", () => {
    const ast = parse(`{a:12,/**1*/}`);

    expect(ast).toEqual({
      type: "Program",
      body: [
        {
          type: "ObjectPattern",
          children: [
            {
              key: {
                loc: {
                  end: {
                    column: 2,
                    line: 1,
                  },
                  start: {
                    column: 2,
                    line: 1,
                  },
                },
                raw: "a",
                type: "Identifier",
                value: "a",
              },
              loc: {
                end: {
                  column: 5,
                  line: 1,
                },
                start: {
                  column: 2,
                  line: 1,
                },
              },
              type: "ObjectProperty",
              value: {
                loc: {
                  end: {
                    column: 5,
                    line: 1,
                  },
                  start: {
                    column: 4,
                    line: 1,
                  },
                },
                raw: "12",
                type: "Literal",
                value: 12,
              },
            },
          ],
          loc: {
            start: {
              line: 1,
              column: 1,
            },
            end: {
              line: 1,
              column: 13,
            },
          },
        },
      ],
      start: 1,
      end: 13,
      comments: [
        {
          loc: {
            end: {
              column: 12,
              line: 1,
            },
            start: {
              column: 7,
              line: 1,
            },
          },
          raw: "/**1*/",
          type: "BlockComment",
          value: ["1"],
        },
      ],
      loc: {
        start: {
          line: 1,
          column: 1,
        },
        end: {
          line: 1,
          column: 13,
        },
      },
    });
  });
});
