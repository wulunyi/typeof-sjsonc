export type Node =
  | Program
  | ObjectPattern
  | ObjectProperty
  | ArrayPattern
  | BaseComment
  | Literal
  | Comment;

export interface BaseNode {
  type: Node["type"];
}

export type Pattern = ArrayPattern | ObjectPattern;

export interface Program extends BaseNode {
  type: "Program";
  body: Pattern[];
  start: number;
  end: number;
  comments: Comment[];
  loc: SourceLocation;
}

export interface ObjectPattern extends BaseNode {
  type: "ObjectPattern";
  children: ObjectProperty[];
  loc: SourceLocation;
}

export type ValueType = ObjectPattern | ArrayPattern | Literal;

export interface ObjectProperty extends BaseNode {
  type: "ObjectProperty";
  key: Identifier;
  value: ValueType;
  loc: SourceLocation;
}

export interface Identifier {
  type: "Identifier";
  value: string;
  raw: string;
  loc: SourceLocation;
}

export interface Location {
  line: number;
  column: number;
}

export interface SourceLocation {
  start: Location;
  end: Location;
}

export interface ArrayPattern extends BaseNode {
  type: "ArrayPattern";
  children: ValueType[];
  loc: SourceLocation;
}

export type BaseType = boolean | string | null | number;

export interface Literal extends BaseNode {
  type: "Literal";
  value: BaseType;
  raw: string;
  loc: SourceLocation;
}

export interface BaseComment extends BaseNode {
  type: Comment["type"];
  raw: string;
  loc: SourceLocation;
}

export type Comment = LineComment | BlockComment;

export interface LineComment extends BaseComment {
  type: "LineComment";
  value: string;
}

export interface BlockComment extends BaseComment {
  type: "BlockComment";
  value: string[];
}
