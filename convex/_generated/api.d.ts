/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as adFunctions from "../adFunctions.js";
import type * as bookChapterFunctions from "../bookChapterFunctions.js";
import type * as bookFunctions from "../bookFunctions.js";
import type * as storageFunctions from "../storageFunctions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  adFunctions: typeof adFunctions;
  bookChapterFunctions: typeof bookChapterFunctions;
  bookFunctions: typeof bookFunctions;
  storageFunctions: typeof storageFunctions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
