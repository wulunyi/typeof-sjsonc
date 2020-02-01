import { parse } from './parser';
import { render } from './render';
import { RenderOptions } from './render/types';

const DEFAULT_OPTIONS: RenderOptions = {
    disallowComments: false,
};

export function typeofSjsonc(
    jsonc: string,
    name = 'root',
    options?: Partial<RenderOptions>
) {
    return render(parse(jsonc, name), Object.assign(DEFAULT_OPTIONS, options));
}

export { parse, render };
