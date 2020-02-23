import { typeofSjsonc } from './index';

const result = typeofSjsonc(
    `//123
    {a: {//111
        aa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa 
    }, b: [123,true, {//111
        aa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa 
    }]} 
    /**12*/{c: 123, a: {}, aaa: {}}`,
    'aaa',
    { disallowComments: false, separate: true }
);

console.log(result);
