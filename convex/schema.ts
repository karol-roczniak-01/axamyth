import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    userId: v.string(),
    title: v.string(),
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
})