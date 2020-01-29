import { render } from './render';
import { parse } from './parser';

const ast = parse(
    'aaa',
    `
{
    /** aaa*/
"aa": true, // a
// b
"b": 123, // hello
d: [123, true], /** aaa */
obj: {
a: true,
b: false
},
e: [
{a: true},
{a: 123}
]
}
`
);

const result = render(ast);

// console.log(JSON.stringify(ast, null, 2));
console.log(result);
