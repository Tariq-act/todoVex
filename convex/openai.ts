import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey });

export const suggestMissingItemsWithAi = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // implementation goes here

    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId,
    });

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify(todos),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-3.5-turbo",
    });
    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;
    console.log({ messageContent });

    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];
      const AI_LABEL_ID = "jx7fxjfzwnfhpe965dw1dmh9gx6whe8c";
      for (let index = 0; index < items.length; index++) {
        const { taskName, description } = items[index];
        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID as Id<"labels">,
        });
      }
    }
  },
});

export const suggestMissingSubItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    taskName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { projectId, parentId, taskName, description }) => {
    // implementation goes here

    const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
      parentId,
    });
    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId,
    });

    const projectName = project?.name || "";

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
            ...{ parentTodo: { taskName, description } },
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-3.5-turbo",
    });
    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;
    console.log({ messageContent });

    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];
      const AI_LABEL_ID = "jx7fxjfzwnfhpe965dw1dmh9gx6whe8c";
      for (let index = 0; index < items.length; index++) {
        const { taskName, description } = items[index];
        await ctx.runMutation(api.subTodos.createASubTodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          parentId,
          labelId: AI_LABEL_ID as Id<"labels">,
        });
      }
    }
  },
});
