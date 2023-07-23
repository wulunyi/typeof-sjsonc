# sjsonc-parser

similar jsonc parser

```any
{
    "name": "sjsonc",
    number: 1234,
    // commentLine
    str: 'str', // commentLine
    /** commentBlock */
    bool: true
}
```

```any
[{
    "name": "sjsonc",
    number: 1234,
    // commentLine
    str: 'str', // commentLine
    /** commentBlock */
    bool: true,
    arr: []
}]
```

## 文法

## 参考文档

- [从零开始写一个 JSON 解析器](https://www.jianshu.com/p/ad56542affd0)
- [自己动手实现一个简单的 JSON 解析器](https://segmentfault.com/a/1190000010998941)
- [来点儿编译原理（1）实现一个小型四则运算编译器](https://zhuanlan.zhihu.com/p/24035780)
- [json-to-ast](https://github.com/vtrushin/json-to-ast)
- [node-jsonc-parser](https://github.com/microsoft/node-jsonc-parser)
- [acorn](https://github.com/acornjs/acorn)
- [moo 词法生成器](https://www.npmjs.com/package/moo)
- [comment-json parse jsonc](https://www.npmjs.com/package/comment-json)
