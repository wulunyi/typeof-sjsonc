import { ObjectNode, NormalNode, ArrayNode, BaseNode } from './types';

export function renderObject(node: ObjectNode): string {
    // 根据名字分组
    // 在数组项中可能一个名字对应不同类型
    const nameGroupMap: Record<string, BaseNode[]> = {};

    node.children.forEach(child => {
        const group = nameGroupMap[child.name];
        if (group) {
            group.push(child);
        } else {
            nameGroupMap[child.name] = [child];
        }
    });

    return `{
        ${Object.entries(nameGroupMap)
            .map(([name, nodeList]) => {
                let tagCount = 0;
                const comments: string[] = [];

                const types = nodeList.map(item => {
                    tagCount += item.tagCount;
                    comments.push(...item.comments);

                    if (item.isNormal()) {
                        return renderNormal(item);
                    }
                    if (item.isObject()) {
                        return renderObject(item);
                    }
                    return renderArray(item);
                });

                const type =
                    types.length === 1 ? types[0] : `${types.join('|')}`;

                const member =
                    node.tagCount > tagCount
                        ? `${name}?: ${type}`
                        : `${name}: ${type}`;

                return member;
            })
            .join('\n')}
    }`;
}

export function renderNormal(node: NormalNode): string {
    if (node.valueTypes.length === 1) {
        return node.valueTypes[0] as string;
    }

    return `${node.valueTypes.join('|')}`;
}

export function renderArray(node: ArrayNode): string {
    let hasPattren = false;
    const types = node.children.reduce((final, child) => {
        if (child.isNormal()) {
            final.push(...child.valueTypes);
        } else if (child.isObject()) {
            hasPattren = true;
            final.push(renderObject(child));
        } else {
            hasPattren = true;
            final.push(renderArray(child));
        }

        return final;
    }, [] as string[]);

    if (types.length === 1) {
        return hasPattren ? `Array<${types[0]}>` : `${types[0]}[]`;
    } else {
        return `Array<${types.join('|')}>`;
    }
}

export function render(node: ObjectNode) {
    return `export interface ${node.name} {
            ${node.children
                .map(child => {
                    let type: string;
                    if (child.isNormal()) {
                        type = renderNormal(child);
                    } else if (child.isObject()) {
                        type = renderObject(child);
                    } else {
                        type = renderArray(child);
                    }

                    return `${child.name}: ${type}`;
                })
                .join('\t\n')}
        }`;
}
