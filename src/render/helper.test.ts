import { sureOptions } from './helper';

describe('Test render helper', () => {
    it('Test suerOptions', () => {
        expect(sureOptions(undefined)).toEqual({
            disallowComments: false,
            separate: false,
        });
    });
});
