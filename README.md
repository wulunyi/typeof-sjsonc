# typeof-sjsonc

将 similar jsonc 转换为 TypeScript 的 interface

## Used

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
