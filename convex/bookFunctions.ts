import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// Queries
export const getBooksByTitle = query({
  args: {
    title: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const allBooks = await ctx.db
      .query("books")
      .withSearchIndex("by_title", (q) => 
        q.search("title", args.title)
      )
      .paginate(args.paginationOpts);
    
    return allBooks;
  },
});

export const getAllUserBooks = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const userBooks = await ctx.db
      .query("books")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .paginate(args.paginationOpts);
     
    return userBooks;
  },
});

export const getUserBooks = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userBooks = await ctx.db
      .query("books")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect()

    return userBooks;
  }
});

export const getBookById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bookId);
  },
});

// Mutations
export const createBook = mutation({
  args: {
    userId: v.string(),
    title: v.string()
  },
  handler: async (ctx, args) => {
    const newBookId = await ctx.db.insert("books", { 
      userId: args.userId,
      title: args.title 
    });
    return newBookId
  }
});

export const editBook = mutation({
  args: {
    bookId: v.id("books"),
    title: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, {
      title: args.title
    });
  },
});