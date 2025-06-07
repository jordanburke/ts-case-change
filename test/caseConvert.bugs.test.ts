import {
  ObjectToCamel,
  ObjectToPascal,
  ObjectToSnake,
  ObjectToCamelPrefix,
  objectToCamel,
  objectToSnake,
  objectToPascal,
  objectToCamelPrefix,
} from "../src"

describe("bug fixes", () => {
  it("#50 - Does not handle an array of objects correctly", () => {
    interface MyObject {
      index: number
      value?: string
    }

    interface MyObjectWithArray {
      object_array: MyObject[]
    }

    type CamelCaseConvertedObjectWithArray = ObjectToCamel<MyObjectWithArray>

    const camelRequest: CamelCaseConvertedObjectWithArray = {
      objectArray: [
        {
          index: 0,
          value: "abc",
        },
      ],
    }

    expect(camelRequest.objectArray?.length).toEqual(1)

    camelRequest.objectArray?.forEach((value) => {
      expect(value.index).toEqual(0)
    })

    type PascalCaseConvertedObjectWithArray = ObjectToPascal<MyObjectWithArray>
    const pascalRequest: PascalCaseConvertedObjectWithArray = {
      ObjectArray: [
        {
          Index: 0,
          Value: "abc",
        },
      ],
    }

    expect(pascalRequest.ObjectArray?.length).toEqual(1)

    pascalRequest.ObjectArray?.forEach((value) => {
      expect(value.Index).toEqual(0)
    })

    interface MyPascalObjectWithArray {
      ObjectArray?: {
        Index: number
        Value?: string
      }[]
    }

    type SnakeCaseConvertedObjectWithArray = ObjectToSnake<MyPascalObjectWithArray>

    const snakeRequest: SnakeCaseConvertedObjectWithArray = {
      object_array: [
        {
          index: 0,
          value: "abc",
        },
      ],
    }

    expect(snakeRequest.object_array?.length).toEqual(1)

    snakeRequest.object_array?.forEach((value) => {
      expect(value.index).toEqual(0)
    })
  })

  it("#52 - objectToCamel return type is a Pascal-cased array when the input is a snake-typed array", () => {
    type SnakeTyped = { key: string; another_key: string }
    type CamelType = { key: string; anotherKey: string }

    const snakeObject: SnakeTyped[] = [{ key: "a", another_key: "b" }]

    const camelObject: CamelType[] = objectToCamel(snakeObject)

    expect(Object.keys(camelObject[0])).toEqual(["key", "anotherKey"])
    expect(camelObject[0].key).toEqual("a")
    expect(camelObject[0].anotherKey).toEqual("b")
  })

  it("#55 - objectToCamel return type is an array when the input is a snake-typed array", () => {
    type SnakeTyped = { key: string; another_key: string }
    type CamelType = { key: string; anotherKey: string }

    const snakeObject: SnakeTyped[] = [{ key: "a", another_key: "b" }]

    const camelArray: CamelType[] = objectToCamel(snakeObject)

    expect(Array.isArray(camelArray)).toBe(true)
    const camelScalarArray = objectToCamel([1])
    expect(Array.isArray(camelScalarArray)).toBe(true)
  })

  it("#58 - does not handle Buffer objects correctly", () => {
    const snakeObject = {
      buffer_key: Buffer.from("abc"),
      nested: { more_nested: Buffer.from("abc") },
      array: [new Uint8Array(Buffer.from("abc"))],
    }
    const convertedSnakeObj = objectToCamel(snakeObject)

    expect(Buffer.isBuffer(convertedSnakeObj.bufferKey)).toBeTruthy()
    expect(Buffer.isBuffer(convertedSnakeObj.nested.moreNested)).toBeTruthy()
    expect(convertedSnakeObj.array[0] instanceof Uint8Array).toBeTruthy()

    const camelObject = {
      bufferKey: Buffer.from("abc"),
      nested: { moreNested: Buffer.from("abc") },
      array: [Buffer.from("abc")],
    }
    const convertedCamelObject = objectToSnake(camelObject)

    expect(Buffer.isBuffer(convertedCamelObject.buffer_key)).toBeTruthy()
    expect(Buffer.isBuffer(convertedCamelObject.nested.more_nested)).toBeTruthy()
    expect(Buffer.isBuffer(convertedCamelObject.array[0])).toBeTruthy()
  })

  it("#78 - does not handle date objects correctly", () => {
    const snakeObject = {
      date_key: new Date(),
      nested: { more_nested: new Date() },
      array: [new Date()],
    }
    const convertedSnakeObj = objectToCamel(snakeObject)

    expect(convertedSnakeObj.dateKey instanceof Date).toBeTruthy()
    expect(convertedSnakeObj.nested.moreNested instanceof Date).toBeTruthy()
    console.log(convertedSnakeObj.array)
    expect(convertedSnakeObj.array[0] instanceof Date).toBeTruthy()
  })

  it("#64 - camel to snake missing property name ending in a number", () => {
    const camelObject = {
      aaaBbb1: "a",
    }
    const snakeObject = objectToSnake(camelObject)
    expect(snakeObject.aaa_bbb_1).toEqual("a")
    expect(Object.keys(snakeObject)).toHaveLength(1)
  })

  it("Array of nullable arrays type preservation in objectToCamel", () => {
    // Test for the bug where string[] | null might be incorrectly typed as just string[]
    interface OriginalType {
      string_array_or_null: (string[] | null)[]
      nested: {
        nullable_array: string[] | null
        array_of_nullable: (string | null)[]
      }
    }

    // Check that types are preserved correctly
    type CamelCase = ObjectToCamel<OriginalType>

    // Create test data
    const original: OriginalType = {
      string_array_or_null: [["a", "b"], null, ["c"]],
      nested: {
        nullable_array: ["test"],
        array_of_nullable: ["a", null, "b"],
      },
    }

    // Convert and verify runtime behavior
    const camelCase = objectToCamel(original)

    // This should compile if types are correct
    const nullableArray: (string[] | null)[] = camelCase.stringArrayOrNull
    const nestedNullable: string[] | null = camelCase.nested.nullableArray

    // Verify actual values
    expect(camelCase.stringArrayOrNull[0]).toEqual(["a", "b"])
    expect(camelCase.stringArrayOrNull[1]).toBeNull()
    expect(camelCase.nested.nullableArray).toEqual(["test"])
    expect(camelCase.nested.arrayOfNullable).toContain(null)

    // Test direct null value for nullable array
    const nullArrayOriginal: OriginalType = {
      string_array_or_null: [["a", "b"], null, ["c"]],
      nested: {
        nullable_array: null,
        array_of_nullable: ["a", null, "b"],
      },
    }

    const nullArrayCamel = objectToCamel(nullArrayOriginal)
    expect(nullArrayCamel.nested.nullableArray).toBeNull()
  })

  it("Array of nullable arrays type preservation in objectToPascal", () => {
    // Define a type with nullable arrays
    interface OriginalType {
      string_array_or_null: (string[] | null)[]
      nested: {
        nullable_array: string[] | null
        array_of_nullable: (string | null)[]
      }
    }

    // Check that types are preserved correctly in Pascal case
    type PascalCase = ObjectToPascal<OriginalType>

    // Create test data
    const original: OriginalType = {
      string_array_or_null: [["a", "b"], null, ["c"]],
      nested: {
        nullable_array: null,
        array_of_nullable: ["a", null, "b"],
      },
    }

    // Convert and verify runtime behavior
    const pascalCase = objectToPascal(original)

    // These should compile if types are correct
    const nullableArray: (string[] | null)[] = pascalCase.StringArrayOrNull
    const nestedNullable: string[] | null = pascalCase.Nested.NullableArray

    // Verify actual values
    expect(pascalCase.StringArrayOrNull[0]).toEqual(["a", "b"])
    expect(pascalCase.StringArrayOrNull[1]).toBeNull()
    expect(pascalCase.Nested.NullableArray).toBeNull()
    expect(pascalCase.Nested.ArrayOfNullable).toContain(null)
  })

  it("Array of nullable arrays type preservation in objectToSnake", () => {
    // Define a type with nullable arrays in camelCase
    interface CamelType {
      stringArrayOrNull: (string[] | null)[]
      nested: {
        nullableArray: string[] | null
        arrayOfNullable: (string | null)[]
      }
    }

    // Check that types are preserved correctly in snake_case
    type SnakeCase = ObjectToSnake<CamelType>

    // Create test data
    const camelData: CamelType = {
      stringArrayOrNull: [["a", "b"], null, ["c"]],
      nested: {
        nullableArray: null,
        arrayOfNullable: ["a", null, "b"],
      },
    }

    // Convert and verify runtime behavior
    const snakeCase = objectToSnake(camelData)

    // These should compile if types are correct
    const nullableArray: (string[] | null)[] = snakeCase.string_array_or_null
    const nestedNullable: string[] | null = snakeCase.nested.nullable_array

    // Verify actual values
    expect(snakeCase.string_array_or_null[0]).toEqual(["a", "b"])
    expect(snakeCase.string_array_or_null[1]).toBeNull()
    expect(snakeCase.nested.nullable_array).toBeNull()
    expect(snakeCase.nested.array_of_nullable).toContain(null)

    // Test with a value in the nullable array
    const camelDataWithArray: CamelType = {
      stringArrayOrNull: [["a", "b"], null, ["c"]],
      nested: {
        nullableArray: ["test1", "test2"],
        arrayOfNullable: ["a", null, "b"],
      },
    }

    const snakeCaseWithArray = objectToSnake(camelDataWithArray)
    expect(snakeCaseWithArray.nested.nullable_array).toEqual(["test1", "test2"])
  })

  it("Array of nullable arrays type preservation in objectToCamelPrefix", () => {
    // Define a type with nullable arrays and prefixes
    interface OriginalType {
      _string_array_or_null: (string[] | null)[]
      __nested: {
        _nullable_array: string[] | null
        array_of_nullable: (string | null)[]
      }
    }

    // Check that types are preserved correctly
    type CamelPrefixType = ObjectToCamelPrefix<OriginalType>

    // Create test data
    const original: OriginalType = {
      _string_array_or_null: [["a", "b"], null, ["c"]],
      __nested: {
        _nullable_array: null,
        array_of_nullable: ["a", null, "b"],
      },
    }

    // Convert and verify runtime behavior
    const camelPrefix = objectToCamelPrefix(original)

    // These should compile if types are correct
    const nullableArray: (string[] | null)[] = camelPrefix._stringArrayOrNull
    const nestedNullable: string[] | null = camelPrefix.__nested._nullableArray

    // Verify actual values and prefix preservation
    expect(camelPrefix._stringArrayOrNull[0]).toEqual(["a", "b"])
    expect(camelPrefix._stringArrayOrNull[1]).toBeNull()
    expect(camelPrefix.__nested._nullableArray).toBeNull()
    expect(camelPrefix.__nested.arrayOfNullable).toContain(null)

    // Test with a value in the nullable array
    const originalWithArray: OriginalType = {
      _string_array_or_null: [["a", "b"], null, ["c"]],
      __nested: {
        _nullable_array: ["test1", "test2"],
        array_of_nullable: ["a", null, "b"],
      },
    }

    const camelPrefixWithArray = objectToCamelPrefix(originalWithArray)
    expect(camelPrefixWithArray.__nested._nullableArray).toEqual(["test1", "test2"])
  })
})

// Bug #50
interface ArrayTypes {
  arrayOfString: string[]
  optionalArrayOfString?: string[]
  arrayOfArrayOfString: string[][]
  optionalArrayOfArrayofString1?: string[][]
  arrayOfOptionalArrayOfString: Array<string[] | undefined>
}

type SnakeArrayTypes = ObjectToSnake<ArrayTypes>

const _snakeArrays1: SnakeArrayTypes = {
  array_of_string: ["a"],
  array_of_array_of_string: [["a"]],
  array_of_optional_array_of_string: [["a"]],
  optional_array_of_string: ["a"],
}

const _snakeArrays2: SnakeArrayTypes = {
  array_of_string: ["a"],
  array_of_array_of_string: [["a"]],
  array_of_optional_array_of_string: [undefined],
  optional_array_of_string: undefined,
}

const _camelArrays1: ObjectToCamel<ArrayTypes> = {
  arrayOfString: ["a"],
  arrayOfArrayOfString: [["a"]],
  arrayOfOptionalArrayOfString: [["a"]],
  optionalArrayOfString: ["a"],
}

const _camelArrays2: ObjectToCamel<ArrayTypes> = {
  arrayOfString: ["a"],
  arrayOfArrayOfString: [["a"]],
  arrayOfOptionalArrayOfString: [undefined],
  optionalArrayOfString: undefined,
}

// Bug #78
const _camelDate: ObjectToCamel<{
  my_date: Date
  arr_date: [Date]
  nested: { inner_date: Date }
}> = {
  myDate: new Date(),
  arrDate: [new Date()],
  nested: { innerDate: new Date() },
}

const _snakeDate: ObjectToSnake<{
  myDate: Date
  arrDate: [Date]
  nested: { innerDate: Date }
}> = {
  my_date: new Date(),
  arr_date: [new Date()],
  nested: { inner_date: new Date() },
}

const _pascalDate: ObjectToPascal<{
  myDate: Date
  arrDate: [Date]
  nested: { innerDate: Date }
}> = {
  MyDate: new Date(),
  ArrDate: [new Date()],
  Nested: { InnerDate: new Date() },
}

// Test for nullable array types
type NullableArrayCheck = ObjectToCamel<{
  array_of_nullables: (string[] | null)[]
}>

// This should be true if the type is preserved correctly
const _nullableArrayCheck: NullableArrayCheck = {
  arrayOfNullables: [["a"], null, ["b"]],
}
