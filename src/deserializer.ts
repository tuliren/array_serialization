import {
  ElementType,
  HEADER_CONTENT_DELIMITER,
  HEADER_ELEMENT_DELIMITER,
  HeaderEntry,
  InputType,
} from './types';

/**
 * Deserialize a string element within the input string.
 * @param startPosition The start position of the element.
 * @param length The length of the serialized string element.
 */
const deserializeStringElement = (input: string, startPosition: number, length: number): string => {
  return input.substring(startPosition, startPosition + length);
};

/**
 * Deserialize a number element within the input string.
 * @param startPosition The start position of the element.
 * @param length The length of the serialized string element.
 */
const deserializeNumberElement = (input: string, startPosition: number, length: number): number => {
  return parseFloat(input.substring(startPosition, startPosition + length));
};

/**
 * Deserialize an array element within the input string.
 * @param startPosition The start position of the element.
 * @param length The length of the serialized string element.
 */
const deserializeArrayElement = (
  input: string,
  startPosition: number,
  length: number
): InputType[] => {
  const headers: HeaderEntry[] = [];

  let cursor = startPosition;
  let startIndex = cursor;

  while (input[cursor] !== HEADER_CONTENT_DELIMITER && cursor < cursor + length) {
    while (
      input[cursor] !== HEADER_ELEMENT_DELIMITER &&
      input[cursor] !== HEADER_CONTENT_DELIMITER &&
      cursor < input.length
    ) {
      cursor++;
    }
    headers.push({
      type: input[startIndex] as ElementType,
      contentLength: parseInt(input.substring(startIndex + 1, cursor), 10),
    });

    if (input[cursor] === HEADER_ELEMENT_DELIMITER) {
      cursor++;
      startIndex = cursor;
    }
  }

  const output: InputType[] = [];
  for (const header of headers) {
    switch (header.type) {
      case ElementType.String:
        output.push(deserializeStringElement(input, cursor + 1, header.contentLength));
        cursor += header.contentLength;
        break;
      case ElementType.Number:
        output.push(deserializeNumberElement(input, cursor + 1, header.contentLength));
        cursor += header.contentLength;
        break;
      case ElementType.Array:
        if (header.contentLength > 0) {
          const array = deserializeArrayElement(input, cursor + 1, header.contentLength);
          output.push(array);
        }
        cursor += header.contentLength;
        break;
      default:
        throw new Error(`Unsupported type: ${header.type}`);
    }
  }

  return output;
};

/**
 * The main function for deserializing an array of strings, numbers, and nested arrays.
 * Runtime complexity: O(N)
 * Space complexity: O(N)
 * N is the length of the input string.
 */
export const deserialize = (input: string): InputType[] => {
  return deserializeArrayElement(input, 0, input.length);
};
