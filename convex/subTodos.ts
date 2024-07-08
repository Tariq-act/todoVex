import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }

    return [];
  },
});

export const getSubTodosByParentId = query({
  args: { parentId: v.id("todos") },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .collect();
    }

    return [];
  },
});

export const checkASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
    return newTaskId;
  },
});

export const unCheckASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
    return newTaskId;
  },
});

export const createASubTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, parentId }
  ) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newTaskId = await ctx.db.insert("subTodos", {
          userId,
          parentId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
        });
        return newTaskId;
      }
      return null;
    } catch (error) {
      console.log("Error occurred during createdASubTodo mutation", error);

      return null;
    }
  },
});

export const completedSubTodos = query({
  args: { parentId: v.id("todos") },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }

    return [];
  },
});

export const inCompletedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }

    return [];
  },
});
