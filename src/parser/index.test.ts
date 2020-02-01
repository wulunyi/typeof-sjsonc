import { parse } from './index';
import { createRObject, createRArray, createRElement } from '../render/types';
import * as sjsoncParser from 'sjsonc-parser';

describe('Test Parser', () => {
    it('Test parse ""', () => {
        expect(parse('', 'Root')).toEqual([]);
    });

    it('Test parse {}', () => {
        expect(parse('{}', 'Root')).toEqual([createRObject('Root')]);
    });

    it('Test parse []', () => {
        expect(parse('[]', 'Root')).toEqual([createRArray('Root')]);
    });

    it('Test parse Element', () => {
        expect(
            parse('{a: 123, b: true, c: {d: []}} [123]', ['Root', 'bbb'])
        ).toEqual([
            createRObject('Root', [
                createRElement('a', ['number']),
                createRElement('b', ['boolean']),
                createRObject('c', [createRArray('d', [])]),
            ]),
            createRArray('bbb', [createRElement('bbb', ['number'])]),
        ]);
    });

    it('Test parse comments', () => {
        const str = `//123\n{a: {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}} \n/**12*/{c: 123}`;
        const comments = sjsoncParser.parse(str).comments;

        expect(parse(str, ['root', 'root2'])).toEqual([
            createRObject(
                'root',
                [
                    createRObject('a', [
                        createRElement(
                            'aa',
                            ['number'],
                            [comments[1], comments[2], comments[3]]
                        ),
                        createRElement(
                            'b',
                            ['boolean'],
                            [comments[4], comments[5]]
                        ),
                    ]),
                ],
                [comments[0]]
            ),
            createRObject(
                'root2',
                [createRElement('c', ['number'])],
                [comments[comments.length - 1]]
            ),
        ]);
    });

    it('Test parse Array', () => {
        const a = createRElement('a', ['number', 'boolean']);
        a.markCount = 2;
        const root = createRObject('root', [a]);
        root.markCount = 2;

        expect(parse(`[{a: 123},{a: true}]`)).toEqual([
            createRArray('root', [root]),
        ]);
    });

    it('Test name set', () => {
        expect(parse(`{} []`)).toEqual([
            createRObject('root'),
            createRArray('root1'),
        ]);
    });
});
