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
} from "sjsonc-parser";
import { isEmpty, includes } from 'lodash-es';

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
  return (
    isAfterLoc(parentLoc.start, commentLoc.start) &&
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
    if (isPre(loc)(commentLoc)) return true;
    if (!isPattern && isNoNextSibling(nextSiblingLoc) && isIn(parentLoc)(commentLoc)) return true;
    if (isPattern && isNoNextSibling(nextSiblingLoc) && isAfter(parentLoc)(commentLoc) && isIn(parentLoc)(commentLoc)) return true;
    if (isIn(parentLoc)(commentLoc) && isAfterNearSameLine(loc, nextSiblingLoc)(commentLoc)) return true;
    return false;
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

    const beLongTo = createBeLongTo(loc, isPattern, parentLoc, nextSiblingLoc);

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

export const isObjectPattern = (n: Node): n is ObjectPattern => n.type === 'ObjectPattern';

export const isArrayPattern = (n: Node): n is ArrayPattern => n.type === 'ArrayPattern';

export const isObjectProperty = (n: Node): n is ObjectProperty => n.type === 'ObjectProperty';

export const isBlockComment = (n: Node): n is BlockComment => n.type === 'BlockComment';

export const isLineComment = (n: Node): n is LineComment => n.type === 'LineComment';

export const createUnionAppend =
  <T>(list: T[]) =>
  (item: T) => {
    if (!includes(list, item)) {
      list.push(item);
    }
  };
