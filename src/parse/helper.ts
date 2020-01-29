import {
    Comment,
    LineComment,
    Node,
    ObjectPattern,
    ArrayPattern,
    ObjectProperty,
} from 'sjsonc-parser/types/parser/types';
import { propEq } from 'ramda';

export function createFindComments(comments: Comment[]) {
    return (line: number) =>
        comments.find(item => {
            return item.loc.start.line === line && item.type === 'LineComment';
        }) as LineComment;
}

export const isObjectPattern = propEq('type', 'ObjectPattern') as (
    n: Node
) => n is ObjectPattern;

export const isArrayPattern = propEq('type', 'ArrayPattern') as (
    n: Node
) => n is ArrayPattern;

export const isObjectProperty = propEq('type', 'ObjectProperty') as (
    n: Node
) => n is ObjectProperty;
