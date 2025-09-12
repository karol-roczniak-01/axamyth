import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Queries
export const getChaptersByBookId = query({
  args: {
    bookId: v.id("books"),
  },
  handler: async (ctx, args) => {
    const bookChapters = await ctx.db
      .query("bookChapters")
      .filter((q) => q.eq(q.field("bookId"), args.bookId))
      .collect()
    
    // Exclude 'content' field from each chapter
    return bookChapters.map(({ content, ...chapter }) => chapter);
  }
});

export const getBookChapterById = query({
  args: { chapterId: v.id("bookChapters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chapterId)
  }
});

// Mutations
export const createBookChapter = mutation({
  args: {
    bookId: v.id("books"),
    title: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const newBookChapterId = await ctx.db.insert("bookChapters", {
      bookId: args.bookId,
      title: args.title,
      content: args.content
    });
    return newBookChapterId
  }
});

export const updateBookChapterTitle = mutation({
  args: {
    chapterId: v.id("bookChapters"),
    title: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chapterId, {
      title: args.title
    })
  }
})

export const updateBookChapterContent = mutation({
  args: {
    chapterId: v.id("bookChapters"),
    content: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chapterId, {
      content: args.content
    });
  },
});

export const deleteBookChapter = mutation({
  args: {
    chapterId: v.id("bookChapters")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.chapterId)
  }
});