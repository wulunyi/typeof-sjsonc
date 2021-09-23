import {
    RefRNode,
    RObject,
    isRObject,
    RArray,
    RElement,
    RNode,
    isRElement,
    RenderOptions,
} from './types';
import { Comment } from 'sjsonc-parser';
import {
    printSpace,
    createPrintComments,
    sureOptions,
    printNameByPrefix,
} from './helper';

export function render(
    nodes: RefRNode[],
    options?: Partial<RenderOptions>
): string {
    const { disallowComments, prefix } = sureOptions(options);
    const printName = printNameByPrefix(prefix);
    const printCommentsAtDeep = createPrintComments(disallowComments);

    function renderArrayAtDeep(node: RArray, deep: number): string {
        let hasPattren = false;

        const types = node.children.reduce((final, child) => {
            if (isRElement(child)) {
                final.push(...child.types);
            } else {
                hasPattren = true;

                if (isRObject(child)) {
                    final.push(renderObjectAtDeep(child, deep));
                } else {
                    final.push(renderArrayAtDeep(child, deep));
                }
            }

            return final;
        }, [] as string[]);

        if (types.length === 0) {
            return 'any[]';
        }

        if (types.length === 1) {
            return hasPattren ? `Array<${types[0]}>` : `${types[0]}[]`;
        }

        return `Array<${types.join('|')}>`;
    }

    function renderElement(node: RElement): string {
        const typeLen = node.types.length;
        const values = [...node.types];

        if (typeLen === 0) {
            return 'any';
        } else if (typeLen === 1) {
            return values[0];
        } else {
            return values.join('|');
        }
    }

    function renderObjectAtDeep(node: RObject, deep: number): string {
        // 根据名字分组
        // 在数组项中可能一个名字对应不同类型
        // 数组合并的时候会将对象进行合并 [{a: 1}, {a: true}]
        const nameGroupMap: Record<string, RNode[]> = {};

        node.children.forEach(child => {
            const group = nameGroupMap[child.name];

            if (group) {
                group.push(child);
            } else {
                nameGroupMap[child.name] = [child];
            }
        });

        let result = '{\n';

        Object.entries(nameGroupMap).forEach(([name, nodes]) => {
            let markCount = 0;
            const comments: Comment[] = [];

            const types = nodes.map(item => {
                markCount += item.markCount;
                comments.push(...item.comments);

                if (isRElement(item)) {
                    return renderElement(item);
                }

                if (isRObject(item)) {
                    return renderObjectAtDeep(item, deep + 1);
                }

                return renderArrayAtDeep(item, deep + 1);
            });

            let type = 'any';

            if (types.length === 1) {
                type = types[0];
            } else if (types.length > 1) {
                type = types.join('|');
            }

            const member =
                node.markCount > markCount
                    ? `${name}?: ${type}`
                    : `${name}: ${type}`;

            if (comments.length > 0) {
                result += printCommentsAtDeep(comments, deep + 1);
            }

            result += `${printSpace(deep + 1)}${member};\n`;
        });

        result += `${printSpace(deep)}}`;

        return result;
    }

    return nodes
        .map((item: RArray | RObject) => {
            if (isRObject(item)) {
                return `${printCommentsAtDeep(
                    item.comments,
                    0
                )}export interface ${printName(item.name)} ${renderObjectAtDeep(
                    item,
                    0
                )}`;
            }

            return `${printCommentsAtDeep(
                item.comments,
                0
            )}export type ${printName(item.name)} = ${renderArrayAtDeep(
                item,
                0
            )}`;
        })
        .join('\n\n');
}
