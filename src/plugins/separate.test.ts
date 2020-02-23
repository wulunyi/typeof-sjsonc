import { createRObject, createRElement } from '../render/types';
import { separate, suffixName } from './separate';

describe('Test separate', () => {
    it('Test suffixName', () => {
        expect(suffixName('name')).toEqual('name1');
        expect(suffixName('name1')).toEqual('name2');
        expect(suffixName('name10')).toEqual('name11');
    });
    it('Test separate', () => {
        const ast = [
            createRObject('Root', [
                createRObject('a', [createRElement('b', ['string'])]),
            ]),
        ];

        expect(separate(ast)).toEqual([
            createRObject('Root', [createRElement('a', ['A'])]),
            createRObject('a', [createRElement('b', ['string'])]),
        ]);
    });
});
