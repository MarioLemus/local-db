import { ArrayType, ObjectType } from "../../types";

function jsonStringify(data: ArrayType | ObjectType) {
  return JSON.stringify(data, null, 2);
}

export { jsonStringify };
