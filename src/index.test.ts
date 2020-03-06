import { typeofSjsonc } from './';

describe('Test typeofSjsonc', () => {
    it('Test separate', () => {
        const result = typeofSjsonc(
            `
            {
                list: [
                    {a: {}},
                    {a: {}}
                ]
            }
            `,
            'Root',
            { separate: true }
        );

        expect(result).toBe(
            `export interface Root {\n\tlist: List[];\n}\n\nexport interface List {\n\ta: A;\n}\n\nexport interface A {\n}`
        );
    });
});
