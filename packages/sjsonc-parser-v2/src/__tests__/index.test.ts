import { parse } from '../parser';

describe('Test sjsonc-parser-v2', () => {
  test('Identifier', () => {
    const ast = parse('code');
    expect(ast).toEqual({
      type: 'Identifier',
      value: 'code',
      raw: 'code',
      loc: {
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
        end: {
          line: 1,
          column: 5,
          offset: 4,
        }
      }
    })
  });

  test('BlockComment', () => {
    const ast = parse(`/* hello world */`);
    expect(ast).toEqual({
      type: 'BlockComment',
      value: ['hello world'],
      raw: "/* hello world */",
      loc: {
        start: {
          line: 1,
          column: 1,
          offset: 0,
        },
        end: {
          line: 1,
          column: 18,
          offset: 17
        }
      }
    })
  })
});