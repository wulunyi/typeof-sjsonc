export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface CommentBlock {
  type: 'BlockComment';
  value: string[];
  raw: string;
  loc: Location;
}

export interface CommentLine {
  type: 'LineComment';
  value: string;
  raw: string;
  loc: Location;
}

export type Comment = CommentBlock | CommentLine;

export interface Location {
  start: Position;
  end: Position;
}

export interface Property {
  type: 'Property';
  key: Identifier;
  value: SJsoncNode;
  trailingComments: Comment[];
  leadingComments: Comment[];
  loc: Location;
}

export interface Identifier {
  type: 'Identifier';
  value: string;
  raw: string;
  loc: Location;
}

export interface LiteralNode {
  type: 'Literal';
  value: number | boolean | string | null;
  raw: string;
  trailingComments: Comment[];
  leadingComments: Comment[];
  loc: Location;
  name?: Identifier;
}

export interface ArrayNode {
  type: 'Array';
  children: SJsoncNode[];
  trailingComments: Comment[];
  leadingComments: Comment[];
  loc: Location;
  name?: Identifier;
}

export interface ObjectNode {
  type: 'Object';
  children: Property[];
  trailingComments: Comment[];
  leadingComments: Comment[];
  loc: Location;
  name?: Identifier;
}

export type SJsoncNode = ObjectNode | ArrayNode | LiteralNode;

export interface Program {
  type: 'Program';
  children: SJsoncNode[];
  loc: Location;
}

// export function parse(code: string): Program;