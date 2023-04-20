import { describe, expect, test } from '@jest/globals';
import { deserialize } from '../src/deserializer';
import { serialize } from '../src/serializer';
import { InputType } from '../src/types';

interface TestCase {
  name: string;
  input: InputType[];
}

const testCases: TestCase[] = [
  {
    name: 'empty array',
    input: [],
  },
  {
    name: 'nested empty array',
    input: [[]],
  },
  {
    name: 'deeply nested empty array',
    input: [[[[[[[[]]], [[[[[[[[[]]]]], [[]]]]]]]]]]],
  },
  {
    name: 'single number',
    input: [1999],
  },
  {
    name: 'number array',
    input: [1, 2.5, 3.7, 4, 5.0],
  },
  {
    name: 'single string',
    input: ['hello'],
  },
  {
    name: 'string array',
    input: ['hello', 'world'],
  },
  {
    name: 'mixed array',
    input: [[], 'hello', [[[[[]]]]], 123, [], ['world', [], ['!', [[[[]]]]]]],
  },
  {
    name: 'header element delimiter',
    input: [
      ',',
      'hel,lo',
      ',,,,',
      'wo,r,,ld',
      123,
      456,
      [',', 'hel,lo', 'wor,ld', 123, 456],
    ],
  },
  {
    name: 'header content delimiter',
    input: [
      '|',
      'hel|lo',
      '||||',
      'wo|r||ld',
      123,
      456,
      ['|', 'hel|lo', 'wor|ld', 123, 456],
    ],
  },
  {
    name: 'header element and content delimiter',
    input: [
      '|,',
      'hel|,lo',
      '||||,',
      'wo|r||,ld',
      123,
      456,
      ['|,', 'hel|,lo', 'wor|,ld', 123, 456],
    ],
  },
  {
    name: 'string elements that are each a serialized string',
    input: ['s1,s4,s9||||||,,,|||,,,', 's1,s1,n3,n1,a1|ab1.52|'],
  },
];

describe('serialization round trip', () => {
  for (const testCase of testCases) {
    test(testCase.name, () => {
      console.info(`Testing ${testCase.name}...`);
      const serialized = serialize(testCase.input);
      const deserialized = deserialize(serialized);
      console.info(`-- Serialized:   ${serialized}`);
      console.info(`-- Deserialized: ${JSON.stringify(deserialized)}`);
      console.info(`-- Input:        ${JSON.stringify(testCase.input)}`);
      expect(deserialized).toEqual(testCase.input);
      console.info();
    });
  }
});
