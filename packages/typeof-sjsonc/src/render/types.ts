import { Comment } from "sjsonc-parser";

export interface RenderOptions {
  /** 禁止产出注释 */
  disallowComments: boolean;
  /** 是否将子结构分割出单独的 interface */
  separate: boolean;
  /** 前缀（例如前缀 I => IData ）*/
  prefix: string;
}

export type RNode = RObject | RArray | RElement;
export type RefRNode = RObject | RArray;

export interface RBaseNode {
  kind: RNode["kind"];
  comments: Comment[];
  markCount: number;
  name: string;
}

export interface RObject extends RBaseNode {
  kind: "Object";
  children: RNode[];
}

export interface RArray extends RBaseNode {
  kind: "Array";
  children: RNode[];
}

export interface RElement extends RBaseNode {
  kind: "Element";
  types: string[];
}

export type PartialExcludeKind<T> = Partial<Omit<T, "kind">>;

export type RCreater<T extends RNode> = (
  name: string,
  children?: T extends RElement ? string[] : RNode[],
  comments?: Comment[]
) => T;

export const createRObject: RCreater<RObject> = (
  name = "",
  children: RNode[] = [],
  comments: Comment[] = []
) => {
  return {
    kind: "Object",
    comments,
    markCount: 1,
    name,
    children,
  };
};

export const isRObject = (n: RNode): n is RObject => n.kind === "Object";

export const createRArray: RCreater<RArray> = (
  name = "",
  children: RNode[] = [],
  comments: Comment[] = []
) => {
  return {
    kind: "Array",
    comments,
    markCount: 1,
    name,
    children,
  };
};

export const isRArray = (n: RNode): n is RArray => n.kind === "Array";

export const createRElement: RCreater<RElement> = (
  name = "",
  types: string[] = [],
  comments: Comment[] = []
) => {
  return {
    kind: "Element",
    comments,
    markCount: 1,
    name,
    types,
  };
};

export const isRElement = (n: RNode): n is RElement => n.kind === "Element";

export const isRefRNode = (n: RNode): n is RefRNode => {
  return isRArray(n) || isRObject(n);
};
