import { typeofSjsonc } from "./";

describe("Test typeofSjsonc", () => {
  it("Test separate", () => {
    const result = typeofSjsonc(
      `
            {
                a: null,
                list: [
                    {a: {}},
                    {a: {}}
                ]
            }
            `,
      "Root",
      { separate: true, prefix: "i" }
    );

    expect(result).toBe(
      "export interface IRoot {\n\ta: null;\n\tlist: IList[];\n}\n\nexport interface IList {\n\ta: IA;\n}\n\nexport interface IA {\n}"
    );
  });
});
