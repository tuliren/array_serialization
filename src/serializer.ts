import {
  ElementType,
  HEADER_ELEMENT_DELIMITER,
  InputType,
  SerializationEntry,
} from './types';

/**
 * Serializes a string element.
 *
 * E.g. "hello" -> {
 *   header: "s5",
 *   content: "hello",
 * }
 */
const serializeStringElement = (str: string): SerializationEntry => {
  return {
    header: `${ElementType.String}${str.length}`,
    content: str,
  };
};

/**
 * Serializes a number element.
 *
 * E.g. 123 -> {
 *   header: "n3",
 *   content: "123",
 * }
 */
const serializeNumberElement = (num: number): SerializationEntry => {
  const content = String(num);
  return {
    header: `${ElementType.Number}${content.length}`,
    content,
  };
};

/**
 * Serializes an array element. This function is recursive to handle nested arrays.
 *
 * E.g. ["hello", 123, ["world"]] -> {
 *   header: "a21",
 *   content: "s5,n3,a8|hello123s5|world",
 * }
 */
const serializeArrayElement = (array: InputType[]): SerializationEntry => {
  const headers: string[] = [];
  const contents: string[] = [];

  let entry: SerializationEntry;
  for (const item of array) {
    if (typeof item === 'string') {
      entry = serializeStringElement(item);
    } else if (typeof item === 'number') {
      entry = serializeNumberElement(item);
    } else if (Array.isArray(item)) {
      entry = serializeArrayElement(item);
    } else {
      throw new Error(`Unsupported item (type ${typeof item}): ${item}`);
    }
    headers.push(entry.header);
    contents.push(entry.content);
  }

  const arrayContent = `${headers.join(
    HEADER_ELEMENT_DELIMITER
  )}|${contents.join('')}`;
  return {
    header: `${ElementType.Array}${arrayContent.length}`,
    content: arrayContent,
  };
};

/**
 * The main function for serializing an array of strings, numbers, and nested arrays.
 *
 * The serialized string has two parts: the header and the content.
 * Take ["hello", 123, ["world"]] as an example. Its serialized string is: "s5,n3,a8|hello123s5|world".
 *
 * The header contains the type and length of each element in the array.
 * Header entries are concatenated with a comma.
 * The header for the above example is "s5,n3,a8", which means:
 * - The 1st element is a string whose serialized string length is 5;
 * - The 2nd element is a number whose serialized string length is 3;
 * - The 3rd element is an array whose serialized string length is 8.
 *
 * The content contains the serialized string of each element in the array.
 * Content entries are concatenated with no delimiter.
 * The content string for the example is "hello123s5|world". This is composed of:
 * - String "hello";
 * - String "123" as the serialized number 123;
 * - String "s5|world" as the serialized array ["world"], which is itself a serialized string.
 *
 * The header and content are concatenated with a pipe character.
 *
 * Runtime complexity: O(N*M)
 * Space complexity: O(N*M)
 * N is the length of the number of elements in the input array.
 * M is the mean length of the elements in the input array.
 */
export const serialize = (input: InputType[]): string => {
  const entry = serializeArrayElement(input);
  return entry.content;
};
