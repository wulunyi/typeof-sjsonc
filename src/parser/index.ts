import {
    createFindComments,
    isArrayPattern,
    isObjectPattern,
    isObjectProperty,
} from './helper';

import * as sjsoncParser from 'sjsonc-parser';
import { Node, Pattern } from 'sjsonc-parser/types/parser/types';
import { __ } from 'ramda';
import {
    RefRNode,
    createRObject,
    createRArray,
    RElement,
    createRElement,
    RNode,
    RCreater,
} from '../render/types';

type ArrayElement<A> = A extends Array<infer T> ? T : never;

export function parse(name: string, jsonc: string): RefRNode[] {
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

        const children = node.children;

        const rchildren = new Set<RNode>();

        children.forEach((child: ArrayElement<typeof children>) => {
            let childName = name;
            let childNode: Node = child;
            let childId = id;

            if (isObjectProperty(child)) {
                const { key, value } = child;
                childNode = value;
                (childName = key.value), (childId = `${id}_${childName}`);
            }

            if (isObjectPattern(childNode)) {
                rchildren.add(transform(childNode, childName, childId + '{}'));
            } else if (isArrayPattern(childNode)) {
                rchildren.add(transform(childNode, childName, childId + '[]'));
            } else {
                const propertyNode = rNodeFactory(
                    childNode,
                    childName,
                    childId + '$',
                    createRElement
                ) as RElement;

                propertyNode.types.add(typeof childNode.value);
                rchildren.add(propertyNode);
            }
        });

        result.children.push(...rchildren);

        return result;
    }

    return ast.body.map(item => transform(item, name, name));
}
