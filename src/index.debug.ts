import { typeofSjsonc } from './index';

const result = typeofSjsonc(
    '//123\n{a: {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}, b: [123,true, {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}]} \n/**12*/{c: 123}',
    'aaa',
    { disallowComments: false }
);

console.log(result);
