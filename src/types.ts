export enum ElementType {
  String = 's',
  Number = 'n',
  Array = 'a',
}

export interface HeaderEntry {
  type: ElementType;
  contentLength: number;
}

export interface SerializationEntry {
  header: string;
  content: string;
}

export type PrimitiveType = string | number;

export type InputType = PrimitiveType | InputType[];

export const HEADER_ELEMENT_DELIMITER = ',';
export const HEADER_CONTENT_DELIMITER = '|';
