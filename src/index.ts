import { parse } from './parser';
import { render } from './render';
import { separate } from './plugins/separate';

export function typeofSjsonc(
    jsonc: string,
    name = 'root',
    options?: Parameters<typeof render>[1]
) {
    const ast = parse(jsonc, name);

    return render(options?.separate ? separate(ast) : ast, options);
}

export { parse, render };
