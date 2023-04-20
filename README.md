# Array Serialization

[![Test](https://github.com/tuliren/array_serialization/actions/workflows/test.yaml/badge.svg)](https://github.com/tuliren/array_serialization/actions/workflows/test.yaml)

## Introduction

The serialized string has two parts: the header and the content.
Take `["hello", 123, ["world"]]` as an example. Its serialized string is: `s5,n3,a8|hello123s5|world`.

The header contains the type and length of each element in the array.
Header entries are concatenated with a comma.
The header for the above example is `s5,n3,a8`, which means:
- The 1st element is a string whose serialized string length is 5;
- The 2nd element is a number whose serialized string length is 3;
- The 3rd element is an array whose serialized string length is 8.

The content contains the serialized string of each element in the array.
Content entries are concatenated with no delimiter.
The content string for the example is `hello123s5|world`. This is composed of:
- String `hello`;
- String `123` as the serialized number `123`;
- String `s5|world` as the serialized array `["world"]`, which is itself a serialized string.

The header and content are concatenated with a pipe character.

## Code

- [serializer.ts](src/serializer.ts): serialize an array of string, number, or arrays to a string.
- [deserializer.ts](src/deserializer.ts): deserialize a string to an array of objects.
- [serialization.test.ts](__tests__/serialization.test.ts): unit test.

## Local development

```sh
yarn install
yarn test
```
