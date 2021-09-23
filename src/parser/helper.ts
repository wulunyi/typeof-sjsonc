import {
    Comment,
    LineComment,
    Node,
    ObjectPattern,
    ArrayPattern,
    ObjectProperty,
    BlockComment,
    SourceLocation,
    Location,
} from 'sjsonc-parser';
import {
    propEq,
    anyPass,
    contains,
    isEmpty,
    allPass,
    always,
    not,
    and,
} from 'ramda';

const isAfterLoc = (aloc: Location, bloc: Location) => {
    return (
        aloc.line < bloc.line ||
        (aloc.line === bloc.line && aloc.column < bloc.column)
    );
};

const isBeforeLoc = (aloc: Location, bloc: Location) => {
    return (
        aloc.line > bloc.line ||
        (aloc.line === bloc.line && aloc.column > bloc.column)
    );
};

const isSameLine = (aloc: Location, bloc: Location) => {
    return aloc.line === bloc.line;
};

const isPre = (asloc: SourceLocation) => (bsloc: SourceLocation) => {
    return isBeforeLoc(asloc.start, bsloc.end);
};

const isAfter = (asloc: SourceLocation) => (bsloc: SourceLocation) => {
    return isAfterLoc(asloc.end, bsloc.start);
};

const isAfterNearSameLine =
    (asloc: SourceLocation, nextSloc?: SourceLocation) =>
    (bsloc: SourceLocation) => {
        return (
            isSameLine(asloc.end, bsloc.start) &&
            isSameLine(bsloc.start, bsloc.end) &&
            isAfterLoc(asloc.end, bsloc.start) &&
            nextSloc !== undefined &&
            isBeforeLoc(nextSloc.start, bsloc.end)
        );
    };

const isIn = (parentLoc: SourceLocation) => (commentLoc: SourceLocation) => {
    return and(
        isAfterLoc(parentLoc.start, commentLoc.start),
        isBeforeLoc(parentLoc.end, commentLoc.end)
    );
};

const isNoNextSibling = (nextSiblingLoc?: SourceLocation) =>
    nextSiblingLoc === undefined;

function createBeLongTo(
    loc: SourceLocation,
    isPattern: boolean,
    parentLoc: SourceLocation,
    nextSiblingLoc?: SourceLocation
) {
    return (commentLoc: SourceLocation) => {
        return anyPass([
            isPre(loc),
            allPass([
                always(not(isPattern)),
                always(isNoNextSibling(nextSiblingLoc)),
                isIn(parentLoc),
            ]),
            allPass([
                always(isPattern),
                always(isNoNextSibling(nextSiblingLoc)),
                isAfter(parentLoc),
                isIn(parentLoc),
            ]),
            allPass([
                isIn(parentLoc),
                isAfterNearSameLine(loc, nextSiblingLoc),
            ]),
        ])(commentLoc);
    };
}

export function createFindComments(comments: Comment[]) {
    const list = comments.slice(0);

    /**
     * @param loc 传入的是作为值的 loc
     * @param nextSiblingLoc loc 所在项的下一个兄弟项的 loc
     */
    return (
        loc: SourceLocation,
        isPattern: boolean,
        parentLoc: SourceLocation,
        nextSiblingLoc?: SourceLocation
    ) => {
        if (isEmpty(list)) {
            return [];
        }

        const beLongTo = createBeLongTo(
            loc,
            isPattern,
            parentLoc,
            nextSiblingLoc
        );

        let len = list.length;

        const result: Comment[] = [];

        while (len--) {
            if (beLongTo(list[len]!.loc)) {
                result.unshift(...list.splice(len, 1));
            }
        }

        return result;
    };
}

export const isObjectPattern = (n: Node): n is ObjectPattern =>
    propEq('type', 'ObjectPattern', n);

export const isArrayPattern = (n: Node): n is ArrayPattern =>
    propEq('type', 'ArrayPattern', n);

export const isObjectProperty = (n: Node): n is ObjectProperty =>
    propEq('type', 'ObjectProperty', n);

export const isBlockComment = (n: Node): n is BlockComment =>
    propEq('type', 'BlockComment', n);

export const isLineComment = (n: Node): n is LineComment =>
    propEq('type', 'LineComment', n);

export const createUnionAppend =
    <T>(list: T[]) =>
    (item: T) => {
        if (!contains(item, list)) {
            list.push(item);
        }
    };
