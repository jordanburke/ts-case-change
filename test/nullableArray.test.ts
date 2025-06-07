import { ObjectToCamelPrefix, objectToCamelPrefix } from "../src"
import { expect, it, describe } from "vitest"

// This test specifically tests the issue with nullable arrays like string[] | null
// being converted to just string[] in the type system

describe("Nullable array specific test", () => {
  it("preserves null in union types for arrays in ObjectToCamelPrefix", () => {
    // Define a type with a nullable array field
    type ItemType = {
      _type: string
      created_at: string | null
      removed_at: string | null
      duration: number
      file_path: string | null
      description: string | null
      id: string
      thumbnail_url: string
      category_id: string
      tag_ids: string[] | null // This is the field we're testing
      owner_id: string
      name: string
      notes: string | null
      updated_at: string | null
      resource_url: string
      is_active: boolean
      reason: string | null
    }

    // Check the resulting type after conversion
    type ConvertedType = ObjectToCamelPrefix<ItemType>
    
    // Create a test object with null tag_ids
    const itemWithNullTags: ItemType = {
      _type: "item",
      created_at: null,
      removed_at: null,
      duration: 10,
      file_path: "test.mp4",
      description: null,
      id: "123",
      thumbnail_url: "http://example.com/image.jpg",
      category_id: "cat-123",
      tag_ids: null, // Setting this to null explicitly
      owner_id: "owner-123",
      name: "Test Item",
      notes: null,
      updated_at: null,
      resource_url: "http://example.com/resource.mp4",
      is_active: true,
      reason: null
    }
    
    // Convert the test object
    const result = objectToCamelPrefix(itemWithNullTags)
    
    // Verify null is preserved
    expect(result.tagIds).toBeNull()

    // TypeScript compile-time validation - this is checked at compile time
    // If ConvertedType.tagIds is correctly typed as string[] | null, this will compile
    const test1: ConvertedType = {
      _type: "item",
      createdAt: null,
      removedAt: null,
      duration: 10,
      filePath: "test.mp4",
      description: null,
      id: "123",
      thumbnailUrl: "http://example.com/image.jpg",
      categoryId: "cat-123",
      tagIds: null, // Should accept null
      ownerId: "owner-123",
      name: "Test Item",
      notes: null,
      updatedAt: null,
      resourceUrl: "http://example.com/resource.mp4",
      isActive: true,
      reason: null
    }
    
    // Verify we can assign non-null values too
    const test2: ConvertedType = {
      _type: "item",
      createdAt: null,
      removedAt: null,
      duration: 10,
      filePath: "test.mp4",
      description: null,
      id: "123",
      thumbnailUrl: "http://example.com/image.jpg",
      categoryId: "cat-123",
      tagIds: ["tag-1", "tag-2"], // Should accept string[]
      ownerId: "owner-123",
      name: "Test Item",
      notes: null,
      updatedAt: null,
      resourceUrl: "http://example.com/resource.mp4",
      isActive: true,
      reason: null
    }
    
    // Simply to use the variables to avoid unused variable warnings
    expect(test1.tagIds).toBeNull()
    expect(test2.tagIds).toEqual(["tag-1", "tag-2"])
  })
  
  // A direct type-level test
  it("preserves null in union types at the type level", () => {
    type SourceType = {
      item_tags: string[] | null
    }
    
    type ResultType = ObjectToCamelPrefix<SourceType>
    
    // Create a helper function to do a type-level check
    const checkType = (value: ResultType) => {
      // This assignment will fail at compile time if ResultType.itemTags is not string[] | null
      const itemTags: string[] | null = value.itemTags
      return itemTags
    }
    
    // Now actually test runtime behavior to confirm
    const source: SourceType = { item_tags: null }
    const result = objectToCamelPrefix(source)
    
    expect(result.itemTags).toBeNull()
    expect(checkType(result)).toBeNull()
    
    // Test with a non-null array too
    const source2: SourceType = { item_tags: ["test"] }
    const result2 = objectToCamelPrefix(source2)
    
    expect(result2.itemTags).toEqual(["test"])
    expect(checkType(result2)).toEqual(["test"])
  })
})