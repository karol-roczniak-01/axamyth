import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    userId: v.string(),
    title: v.string(),
    ads: v.optional(v.array(v.object({
      id: v.id("ads"),
      amount: v.number()
    })))
  })
  .searchIndex("by_title", {
    searchField: "title",
    staged: false
  }),

  bookChapters: defineTable({
    bookId: v.id("books"),
    title: v.string(),
    content: v.any()
  })
  .searchIndex("by_title", {
    searchField: "title",
    staged: false
  }),

  ads: defineTable({
    userId: v.string(),
    type: v.string(),
    layout: v.string(),
    title: v.string(),
    description: v.string(),
    price: v.optional(v.number()),
    buttonText: v.string(),
    buttonUrl: v.string(),
    imagePath: v.optional(v.string()),
    public: v.boolean(),
  })
})