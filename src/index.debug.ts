import { render } from './render';
import { parse } from './parse';

const result = render(
    parse(
        'aaa',
        `
{
    /*
    * aaa
    */
    "aa": true, // a
    // b
    "b": 123, // hello
    d: [123, true],
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
    )
);

console.log(result);
debugger;
