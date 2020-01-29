import {
    Comment,
    LineComment,
    Node,
    ObjectPattern,
    ArrayPattern,
    ObjectProperty,
    BlockComment,
} from 'sjsonc-parser/types/parser/types';
import { propEq, anyPass, head, contains } from 'ramda';

const isSameLine = (line: number) => (comment: Comment) =>
    comment.loc.start.line === comment.loc.end.line &&
    comment.loc.end.line === line;

const isPreLine = (line: number) => (comment: Comment) =>
    comment.loc.end.line < line;

const commentBelongToLine = (comment: Comment, line: number) =>
    anyPass([isSameLine(line), isPreLine(line)])(comment);

export function createFindComments(comments: Comment[]) {
    const list = comments.slice(0);

    return (line: number): Comment[] => {
        if (list.length === 0) {
            return [];
        }

        const result: Comment[] = [];

        while (list.length) {
            if (commentBelongToLine(head(list)!, line)) {
                result.push(list.shift()!);
            } else {
                break;
            }
        }

        return result;
    };
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

export const isBlockComment = propEq('type', 'BlockComment') as (
    n: Node
) => n is BlockComment;

export const isLineComment = propEq('type', 'LineComment') as (
    n: Node
) => n is LineComment;

export const createUnionAppend = <T>(list: T[]) => (item: T) => {
    if (!contains(item, list)) {
        list.push(item);
    }
};
