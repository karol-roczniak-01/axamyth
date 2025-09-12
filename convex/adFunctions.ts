import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Queries
export const getAdById = query({
  args: { adId: v.id("ads") },
  handler: async (ctx, args) => {
    const ad = await ctx.db.get(args.adId);
    
    if (!ad) {
      return null;
    }

    return {
      ...ad,
      // Add imageUrl if imagePath exists
      ...(ad.imagePath 
        ? { imageUrl: await ctx.storage.getUrl(ad.imagePath as Id<"_storage">) }
        : {}),
    };
  }
});

export const getUserAds = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userAds = await ctx.db
      .query("ads")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect()

    return userAds;
  }
});

// Mutations
export const createAd = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    layout: v.string(),
    title: v.string(),
    description: v.string(),
    buttonText: v.string(),
    buttonUrl: v.string(),
    public: v.boolean()
  },
  handler: async (ctx, args) => {
    const newAdId = await ctx.db.insert("ads", {
      userId: args.userId,
      type: args.type,
      layout: args.layout,
      title: args.title,
      description: args.description,
      buttonText: args.buttonText,
      buttonUrl: args.buttonUrl,
      public: args.public,
    });
    return newAdId
  }
});

export const addAdToBook = mutation({
  args: {
    bookId: v.id("books"),
    adId: v.id("ads"),
    amount: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookId, {
      
    })
  }
});

export const editAd = mutation({
  args: {
    adId: v.id("ads"),
    layout: v.string(),
    title: v.string(),
    price: v.optional(v.number()),
    description: v.string(),
    buttonText: v.string(),
    buttonUrl: v.string(),
    imagePath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      layout: args.layout,
      title: args.title,
      price: args.price,
      description: args.description,
      buttonText: args.buttonText,
      buttonUrl: args.buttonUrl
    };

    // Only update imagePath if provided
    if (args.imagePath !== undefined) {
      updates.imagePath = args.imagePath;
    }

    await ctx.db.patch(args.adId, updates);
  }
});
