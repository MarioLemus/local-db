type ArrayType = Array<
  string | number | boolean | Set | ArrayType | ObjectType
>;

type ObjectType = {
  [key: string]: string | number | boolean | ArrayType | ObjectType;
};

export { ArrayType, ObjectType };
