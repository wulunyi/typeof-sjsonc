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
} from 'sjsonc-parser/types/parser/types';
import { __, forEach } from 'ramda';
import {
    RefRNode,
    createRObject,
    createRArray,
    RElement,
    createRElement,
    RNode,
    RCreater,
} from '../render/types';

export function parse(name: string | string[], jsonc: string): RefRNode[] {
    name = Array.isArray(name) ? name : [name];
    const ast = sjsoncParser.parse(jsonc);
    const findComments = createFindComments(ast.comments);

    // 合并结构辅助
    const nodeSet = new Map<string, RNode>();

    function rNodeFactory<T extends RNode>(
        node: Node,
        name: string,
        id: string,
        creator: RCreater<T>
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
            resultNode.comments.push(...findComments(node.loc.start.line));
        } else {
            resultNode.comments.push(...findComments(node.loc.end.line));
        }

        return resultNode;
    }

    function transform(node: Pattern, name: string, id: string): RefRNode {
        const result = isObjectPattern(node)
            ? rNodeFactory(node, name, id, createRObject)
            : rNodeFactory(node, name, id, createRArray);

        const unionAppend = createUnionAppend(result.children);

        forEach((child: ObjectProperty | ValueType) => {
            let childName = name;
            let valudeNode: Node = child;
            let valueId = id;

            if (isObjectProperty(child)) {
                const { key, value } = child;
                valudeNode = value;
                (childName = key.value), (valueId = `${id}_${childName}`);
            }

            if (isObjectPattern(valudeNode)) {
                unionAppend(transform(valudeNode, childName, valueId + '{}'));
            } else if (isArrayPattern(valudeNode)) {
                unionAppend(transform(valudeNode, childName, valueId + '[]'));
            } else {
                const propertyNode = rNodeFactory(
                    valudeNode,
                    childName,
                    valueId + '$',
                    createRElement
                ) as RElement;

                createUnionAppend(propertyNode.types)(typeof valudeNode.value);

                unionAppend(propertyNode);
            }
        })(node.children);

        return result;
    }

    return ast.body.map((item, index) => {
        const nameAlias = name[index] || name[0] + index;

        return transform(item, nameAlias, nameAlias);
    });
}
