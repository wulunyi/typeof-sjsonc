import { BaseNode, ObjectNode, NormalNode, ArrayNode } from '../render/types';
import {
    createFindComments,
    isArrayPattern,
    isObjectPattern,
    isObjectProperty,
} from './helper';

import * as sjsoncParser from 'sjsonc-parser';
import { Node, Pattern } from 'sjsonc-parser/types/parser/types';
import { propEq, head, indexOf, __, partialRight } from 'ramda';

type ArrayElement<A> = A extends Array<infer T> ? T : never;

export function parse(name: string, jsonc: string): ObjectNode {
    const ast = sjsoncParser.parse(jsonc);

    const comments = ast.comments;

    const findComments = createFindComments(comments);

    const nodeSet = new Map<string, BaseNode>();

    let result!: ObjectNode;

    function nodeFactory<T extends BaseNode>(
        node: Node,
        name: string,
        id: string,
        comments: string[],
        creator: (name: string) => T
    ): T {
        let resultNode: T;

        if (nodeSet.has(id)) {
            resultNode = nodeSet.get(id) as T;
            resultNode.tagCount += 1;
        } else {
            resultNode = creator(name);
            nodeSet.set(id, resultNode);

            if (result === undefined) {
                result = resultNode;
            }
        }

        resultNode.comments.push(...comments);

        const comment = findComments(node.loc.end.line);

        if (comment) {
            resultNode.comments.push(comment.value.trim());
        }

        return resultNode;
    }

    function transform(
        node: Pattern,
        name: string,
        id: string,
        comments: string[]
    ): ObjectNode {
        const creator = propEq('type', 'ObjectPattern', node)
            ? ObjectNode.create
            : ArrayNode.create;

        const result = nodeFactory(node, name, id, comments, creator);

        const children = node.children;

        const getRealIndex = partialRight(indexOf, [children]);

        children.forEach((child: ArrayElement<typeof children>) => {
            let childName = name;
            let childNode: Node = child;
            let childId = id;

            if (isObjectProperty(child)) {
                const { key, value } = child;
                childNode = value;
                (childName = key.value), (childId = `${id}_${childName}`);
            }

            // const comments = getComments(child, getRealIndex(child));

            if (isObjectPattern(childNode)) {
                result.add(
                    transform(childNode, childName, childId + '{}', comments)
                );
            } else if (isArrayPattern(childNode)) {
                result.add(
                    transform(childNode, childName, childId + '[]', comments)
                );
            } else {
                const propertyNode = nodeFactory(
                    childNode,
                    childName,
                    childId + '$',
                    comments,
                    NormalNode.create
                );

                propertyNode.addType(typeof childNode.value);
                result.add(propertyNode);
            }
        });

        return result;
    }

    if (ast.body.length !== 1) {
        throw new Error('格式不对');
    }

    return transform(head(ast.body)!, name, name, []);
}
