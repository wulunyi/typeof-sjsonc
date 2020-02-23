/**
 * @description 将 AST 中对象结构拆分到顶层
 */
import {
    RefRNode,
    RNode,
    isRObject,
    isRArray,
    createRElement,
} from '../render/types';
import { camel } from '../render/helper';
import { merge, clone } from 'ramda';

export function suffixName(name: string) {
    if (/\d+$/.test(name)) {
        return name.replace(/\d+$/, m => {
            return `${Number.parseInt(m, 10) + 1}`;
        });
    }

    return name + 1;
}

export function createUnionName() {
    const names = new Set<string>();

    function getName(name: string): string {
        if (names.has(name)) {
            return getName(suffixName(name));
        } else {
            names.add(name);
        }

        return name;
    }

    return getName;
}

export function layerNode(node: RNode, index: number, parent: RNode[]) {
    return {
        node,
        replace(finalNode: RNode) {
            parent.splice(index, 1, finalNode);
        },
    };
}

type NodePath = ReturnType<typeof layerNode>;

export function separate(ast: RefRNode[]): RefRNode[] {
    const result: RefRNode[] = [];
    const unionName = createUnionName();

    let preLayer: NodePath[] = clone(ast).map(layerNode);
    let nextLayer: NodePath[] = [];

    let layer = 1;

    while (true) {
        preLayer.forEach(({ node, replace }) => {
            if (isRObject(node)) {
                const name = unionName(node.name);

                result.push(merge(node, { name }));

                replace(createRElement(node.name, [camel(name)]));

                nextLayer.push(...node.children.map(layerNode));
            } else if (isRArray(node)) {
                if (layer === 1) {
                    const name = unionName(node.name);

                    result.push(merge(node, { name }));
                }

                nextLayer.push(...node.children.map(layerNode));
            }
        });

        if (nextLayer.length === 0) {
            break;
        } else {
            preLayer = nextLayer;
            nextLayer = [];
            layer += 1;
        }
    }

    return result;
}
