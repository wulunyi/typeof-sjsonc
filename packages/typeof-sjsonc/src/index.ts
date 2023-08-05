import { parse } from "./parser";
import { render } from "./render";
import { separate } from "./plugins/separate";
import { RenderOptions } from "./render/types";

export function typeofSjsonc(
  jsonc: string,
  name = "root",
  options?: Partial<RenderOptions>
) {
  const ast = parse(jsonc, name);

  return render(options?.separate ? separate(ast, options) : ast, options);
}

export { parse, render };
