import { ObjectToCamelPrefix } from "../src"
import { describe, it, expect } from "vitest"

describe("Simplified test for null preservation", () => {
  it("preserves null in union types with arrays", () => {
    // Simplified test for null preservation in array types
    type SimpleSnakeType = {
      item_tags: string[] | null
    }
    
    // This should preserve the | null in the type
    type SimpleCamelType = ObjectToCamelPrefix<SimpleSnakeType>
    
    // This will fail to compile if SimpleCamelType.itemTags doesn't include null
    const test1: SimpleCamelType = {
      itemTags: null
    }
    
    // This will fail to compile if SimpleCamelType.itemTags doesn't include string[]
    const test2: SimpleCamelType = {
      itemTags: ["test"]
    }
    
    // Verify that both null and array values work
    expect(test1.itemTags).toBeNull()
    expect(test2.itemTags).toEqual(["test"])
  })
})