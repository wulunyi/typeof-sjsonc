import { render } from './render';
import { parse } from './parser';

const ast = parse(
    'aaa',
    `//123\n{a: {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}} \n/**12*/{c: 123}`
);

const result = render(ast);

// console.log(JSON.stringify(ast, null, 2));
console.log(result);
