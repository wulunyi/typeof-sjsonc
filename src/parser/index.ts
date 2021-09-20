import {
    createFindComments,
    isArrayPattern,
    isObjectPattern,
    isObjectProperty,
    createUnionAppend,
} from './helper';

import * as sjsoncParser from 'sjsonc-parser';
import {
    Node,
    Pattern,
    ObjectProperty,
    ValueType,
    Program,
} from 'sjsonc-parser/types/parser/types';
import {
    RefRNode,
    createRObject,
    createRArray,
    RElement,
    createRElement,
    RNode,
    RCreater,
} from '../render/types';

export function parse(
    jsonc: string,
    name: string | string[] = 'root'
): RefRNode[] {
    name = Array.isArray(name) ? name : [name];
    const ast = sjsoncParser.parse(jsonc);
    const findComments = createFindComments(ast.comments);

    // 合并结构辅助
    const nodeSet = new Map<string, RNode>();

    function rNodeFactory<T extends RNode>(
        node: Node,
        name: string,
        id: string,
        creator: RCreater<T>,
        parent: Program | Pattern,
        nextSibling?: Node
    ): T {
        let resultNode: T;

        if (nodeSet.has(id)) {
            resultNode = nodeSet.get(id) as T;
            resultNode.markCount += 1;
        } else {
            resultNode = creator(name);
            nodeSet.set(id, resultNode);
        }

        if (isObjectPattern(node) || isArrayPattern(node)) {
            resultNode.comments.push(
                ...findComments(node.loc, true, parent.loc, nextSibling?.loc)
            );
        } else {
            resultNode.comments.push(
                ...findComments(node.loc, false, parent.loc, nextSibling?.loc)
            );
        }

        return resultNode;
    }

    function transform(
        node: Pattern,
        name: string,
        id: string,
        parent: Program | Pattern,
        nextSibling?: Node
    ): RefRNode {
        const result = isObjectPattern(node)
            ? rNodeFactory(node, name, id, createRObject, parent, nextSibling)
            : rNodeFactory(node, name, id, createRArray, parent, nextSibling);

        const unionAppend = createUnionAppend(result.children);

        node.children.forEach(
            (child: ObjectProperty | ValueType, index: number) => {
                let childName = name;
                let valudeNode: Node = child;
                let valueId = id;
                const nextSiblingChild = node.children[index + 1];

                if (isObjectProperty(child)) {
                    const { key, value } = child;
                    valudeNode = value;
                    (childName = key.value), (valueId = `${id}_${childName}`);
                }

                if (isObjectPattern(valudeNode)) {
                    unionAppend(
                        transform(
                            valudeNode,
                            childName,
                            valueId + '{}',
                            node,
                            nextSiblingChild
                        )
                    );
                } else if (isArrayPattern(valudeNode)) {
                    unionAppend(
                        transform(
                            valudeNode,
                            childName,
                            valueId + '[]',
                            node,
                            nextSiblingChild
                        )
                    );
                } else {
                    const propertyNode = rNodeFactory(
                        valudeNode,
                        childName,
                        valueId + '$',
                        createRElement,
                        node,
                        nextSiblingChild
                    ) as RElement;

                    const type = typeof valudeNode.value;

                    createUnionAppend(propertyNode.types)(
                        valudeNode.value === null ? 'null' : type
                    );

                    unionAppend(propertyNode);
                }
            }
        );

        return result;
    }

    return ast.body.map((item, index, arr) => {
        const nameAlias = name[index] || name[0] + index;

        return transform(item, nameAlias, nameAlias, ast, arr[index + 1]);
    });
}
