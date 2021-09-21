import { parse } from '../parser/index';
import { render } from './index';
import { camel, createPrintComments } from './helper';

describe('Test render', () => {
    it('Test render', () => {
        const ast = parse(
            '//123\n{a: {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}, b: [123,true, {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}]} \n/**12*/{c: 123}',
            'abc'
        );

        expect(render(ast, { disallowComments: false })).toBe(
            '/** 123 */\nexport interface Abc {\n\ta: {\n\t\t/**\n\t\t * 111\n\t\t * 22\n\t\t * eee\n\t\t */\n\t\taa: number;\n\t\t/**\n\t\t * bbb\n\t\t * aaa\n\t\t */\n\t\tb: boolean;\n\t};\n\tb: Array<number|boolean|{\n\t\t/**\n\t\t * 111\n\t\t * 22\n\t\t * eee\n\t\t */\n\t\taa: number;\n\t\t/**\n\t\t * bbb\n\t\t * aaa\n\t\t */\n\t\tb: boolean;\n\t}>;\n}\n\n/** 12 */\nexport interface Abc1 {\n\tc: number;\n}'
        );

        expect(
            render(parse('[{a: 123}, {a: true}]'), { disallowComments: false })
        ).toBe('export type Root = Array<{\n\ta: number|boolean;\n}>');
    });

    it('Test camel', () => {
        expect(camel('aa-aa')).toBe('AaAa');
    });

    it('Test disableComments', () => {
        expect(render(parse('/**123*/{}'), { disallowComments: true })).toBe(
            'export interface Root {\n}'
        );
    });

    it('Test createPrintComments', () => {
        expect(createPrintComments(false)([], 0)).toBe('');
    });
});
