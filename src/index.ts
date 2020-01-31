import { parse } from './parser';
import { render } from './render';

export function typeofSjsonc(jsonc: string, name = 'root') {
    return render(parse(name, jsonc));
}

export { parse, render };
