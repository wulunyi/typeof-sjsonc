import { render } from './render';
import { parse } from './parser';

const ast = parse(
    'aaa',
    `
    /** test */
{aa: 123, b: true /**222*/}/**aaa*/{c: 123}


// aaa
[{aa: 1234}]
`
);

const result = render(ast);

// console.log(JSON.stringify(ast, null, 2));
console.log(result);
