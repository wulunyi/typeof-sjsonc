# typeof-sjsonc[![npm version](https://badge.fury.io/js/typeof-sjsonc.svg)](https://badge.fury.io/js/typeof-sjsonc)

将 similar jsonc 转换为 TypeScript 的 interface

```txt
{
    // 123
    "a": 123,
    /** true */
    b: true,
    c: [{d: 'test'}]
}
```

```typescript
export interface Root {
    /** 123 */
    a: number;
    /** true */
    b: boolean;
    c: Array<{
        d: string;
    }>;
}
```

## Usage

npm

```shell
npm i typeof-sjsonc --save
```

yarn

```shell
yarn add typeof-sjsonc --save
```

use

```typescript
import { typeofSjsonc } from 'typeof-sjsonc';

typeofSjsonc(
    '//123\n{a: {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}, b: [123,true, {//111\naa/**22*/: 123, /**eee*/ b: true,/**bbb*/ // aaa \n}]} \n/**12*/{c: 123}',
    'aaa'
);
```

Result

```typescript
/** 123 */
export interface Aaa {
    a: {
        /**
         * 111
         * 22
         * eee
         */
        aa: number;
        /**
         * bbb
         * aaa
         */
        b: boolean;
    };
    b: Array<
        | number
        | boolean
        | {
              /**
               * 111
               * 22
               * eee
               */
              aa: number;
              /**
               * bbb
               * aaa
               */
              b: boolean;
          }
    >;
}

/** 12 */
export interface Aaa1 {
    c: number;
}
```

## API

### typeofSjsonc(jsonc: string, name?: string, options?: {disallowComments?: boolean})

-   jsonc: 待抓换的字符串
-   name: interface 的名字，默认为 root
-   options: 配置项
    -   disallowComments: 不产出注释，默认为 false
    -   separate: 是否将子结构分割出单独的 interface，默认值 false
    -   prifix: 是否添加前缀，例如添加 I

## License

MIT
