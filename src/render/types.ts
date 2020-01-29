export enum NodeType {
    OBJECT = 'object',
    ARRAY = 'array',
    NORMAL = 'normal',
}

export class BaseNode {
    comments: string[] = [];
    tagCount = 1;
    type!: NodeType;
    children: BaseNode[] = [];

    constructor(readonly name: string) {}

    add(node: BaseNode) {
        if (!this.children.includes(node)) {
            this.children.push(node);
        }
    }

    isObject(): this is ObjectNode {
        return this.type === NodeType.OBJECT;
    }

    isNormal(): this is NormalNode {
        return this.type === NodeType.NORMAL;
    }

    isArray(): this is ArrayNode {
        return this.type === NodeType.ARRAY;
    }
}

export class ObjectNode extends BaseNode {
    static create(name: string) {
        return new ObjectNode(name);
    }

    type = NodeType.OBJECT;
}

export class ArrayNode extends BaseNode {
    static create(name: string) {
        return new ArrayNode(name);
    }

    type = NodeType.ARRAY;
}

export class NormalNode extends BaseNode {
    static create(name: string) {
        return new NormalNode(name);
    }

    type = NodeType.NORMAL;
    valueTypes: string[] = [];

    addType(type: string) {
        if (!this.valueTypes.includes(type)) {
            this.valueTypes.push(type);
        }
    }
}
