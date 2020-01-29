import { parse } from './index';
import { ObjectNode, NormalNode, ArrayNode } from '../render/types';

test('parse normal type', () => {
    expect(parse('root', `{}`)).toEqual(ObjectNode.create('root'));

    const t1 = ObjectNode.create('root');
    const tn1 = NormalNode.create('name');

    tn1.addType('string');
    tn1.comments.push('test1');
    tn1.comments.push('test2');

    const tn2 = NormalNode.create('age');

    tn2.addType('number');
    tn2.comments.push('aaaa');

    t1.add(tn1);
    t1.add(tn2);

    expect(
        parse(
            'root',
            `{
                // test1
                name: 'test', // test2
                /** aaaa */
                age: 123
            }`
        )
    ).toEqual(t1);
});

test('parse array', () => {
    const root = ObjectNode.create('root');
    const arr = ArrayNode.create('list');
    const item = NormalNode.create('list');
    item.valueTypes.push('boolean');
    item.valueTypes.push('number');
    item.valueTypes.push('object');
    item.valueTypes.push('string');
    item.valueTypes.push('any');
    item.tagCount = 5;
    arr.children.push(item);
    root.children.push(arr);

    expect(
        parse(
            'root',
            `{
               list: [true, 1234, null, 'string', undefined]
            }`
        )
    ).toEqual(root);
});

test('parse array merge', () => {
    const root = ObjectNode.create('root');
    const arr = ArrayNode.create('list');
    const item = ObjectNode.create('list');
    const a = NormalNode.create('a');
    a.valueTypes.push('number');
    const b = NormalNode.create('b');
    b.valueTypes.push('number');

    item.tagCount = 2;
    item.children.push(a, b);
    arr.children.push(item);
    root.children.push(arr);

    expect(
        parse(
            'root',
            `{
               list: [{
                   a: 1234,
               }, {
                   b: 1234
               }]
            }`
        )
    ).toEqual(root);
});
