/**
 * @description 将 AST 中对象结构拆分到顶层
 */
import {
    RefRNode,
    RNode,
    isRObject,
    createRElement,
    isRefRNode,
} from '../render/types';
import { printNameByPrefix } from '../render/helper';
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
            // 替换后还是保留标记计数
            finalNode.markCount = node.markCount;
            parent.splice(index, 1, finalNode);
        },
    };
}

type NodePath = ReturnType<typeof layerNode>;

export function separate(
    ast: RefRNode[],
    options: { prefix?: string } = {}
): RefRNode[] {
    const printName = printNameByPrefix(options.prefix ?? '');
    const result: RefRNode[] = [];
    const layer1Len = ast.length;
    const unionName = createUnionName();

    const queue: NodePath[] = clone(ast).map(layerNode);

    while (queue.length) {
        const { node, replace } = queue.shift()!;

        if (isRefRNode(node)) {
            const isObj = isRObject(node);

            // ast.length > result.length 表示顶层
            if (layer1Len > result.length || isObj) {
                const name = unionName(node.name);

                result.push(merge(node, { name }));

                if (isObj) {
                    replace(createRElement(node.name, [printName(name)]));
                }
            }

            queue.push(...node.children.map(layerNode));
        }
    }

    return result;
}
