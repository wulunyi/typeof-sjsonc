import { createRObject, createRElement } from '../render/types';
import { separate, suffixName } from './separate';

describe('Test separate', () => {
    it('Test suffixName', () => {
        expect(suffixName('name')).toEqual('name1');
        expect(suffixName('name1')).toEqual('name2');
        expect(suffixName('name10')).toEqual('name11');
    });
    it('Test separate', () => {
        const objA = createRObject('a', [createRElement('b', ['string'])]);
        objA.markCount = 2;

        const ast = [createRObject('Root', [objA])];

        const newStrA = createRElement('a', ['A']);
        newStrA.markCount = 2;

        expect(separate(ast)).toEqual([createRObject('Root', [newStrA]), objA]);
    });
});
