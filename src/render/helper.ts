import { isBlockComment } from '../parser/helper';
import { sortWith, ascend, path, merge } from 'ramda';
import { Comment } from 'sjsonc-parser';
import { RenderOptions } from './types';

const DEFAULT_OPTIONS: RenderOptions = {
    disallowComments: false,
    separate: false,
    prefix: '',
};

export const sureOptions = merge(DEFAULT_OPTIONS) as (
    options?: Partial<RenderOptions>
) => RenderOptions;

export function camel(name: string) {
    return (
        name.substr(0, 1).toLocaleUpperCase() +
        name.slice(1).replace(/-(\w)/g, ($0, $1) => {
            return $1.toUpperCase();
        })
    );
}

export function printSpace(deep: number) {
    let result = '';

    while (deep--) {
        result += '\t';
    }

    return result;
}

export const createPrintComments =
    (disallowComments: boolean) => (comments: Comment[], deep: number) => {
        if (disallowComments) {
            return '';
        }

        comments = sortWith(
            [
                ascend(path(['loc', 'start', 'line'])),
                ascend(path(['loc', 'start', 'column'])),
            ],
            comments
        );

        const values = comments.reduce((final, cur) => {
            if (isBlockComment(cur)) {
                final.push(...cur.value);
            } else {
                final.push(cur.value);
            }

            return final;
        }, [] as string[]);

        if (values.length === 0) {
            return '';
        }

        if (values.length === 1) {
            return `${printSpace(deep)}/** ${values[0]} */\n`;
        }

        let result = `${printSpace(deep)}/**\n`;

        values.forEach(v => {
            result += `${printSpace(deep)} * ${v}\n`;
        });

        result += `${printSpace(deep)} */\n`;
        return result;
    };

export const printNameByPrefix = (prefix: string) => (name: string) =>
    camel(prefix) + camel(name);
