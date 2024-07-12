/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_AI_KEY;

if (!apiKey) {
  throw new Error("API key is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const suggestMissingItemsWithAi = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    try {
      const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
        projectId,
      });

      const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [],
      });

      const response = await chatSession.sendMessage(
        "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions :" +
          JSON.stringify({ todos })
      );

      const jsonString = response.response.text();

      if (jsonString) {
        // Remove leading and trailing markdown syntax
        const jsonContent = jsonString
          .replace(/^```json\n/, "")
          .replace(/\n``` \n$/, "")
          .trim();

        // Parse the JSON string
        const parsedObject = JSON.parse(jsonContent);

        // Example of processing parsed todos
        const AI_LABEL_ID = "jx7fxjfzwnfhpe965dw1dmh9gx6whe8c";
        for (let todo of parsedObject.todos) {
          const { taskName, description } = todo;
          const embedding = await getEmbeddingsWithAI(taskName);
          await ctx.runMutation(api.todos.createATodo, {
            taskName,
            description,
            priority: 1,
            dueDate: new Date().getTime(),
            projectId,
            labelId: AI_LABEL_ID as Id<"labels">,
            embedding,
          });
        }
      } else {
        console.error("Failed to get valid JSON response from AI.");
      }
    } catch (error) {
      console.error("Error in suggestMissingItemsWithAi:", error);
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
    try {
      const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
        parentId,
      });
      const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
        projectId,
      });

      const projectName = project?.name || "";

      const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [],
      });

      const response = await chatSession.sendMessage(
        "I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions :" +
          JSON.stringify({
            todos,
            projectName,
            ...{ parentTodo: { taskName, description } },
          })
      );

      const jsonString = response.response.text();

      if (jsonString) {
        // Remove leading and trailing markdown syntax
        const jsonContent = jsonString
          .replace(/^```json\n/, "")
          .replace(/\n```\n[\s\S]*$/, "");

        // Parse the JSON string
        const parsedObject = JSON.parse(jsonContent);

        const AI_LABEL_ID = "jx7fxjfzwnfhpe965dw1dmh9gx6whe8c";
        const items = parsedObject.todos; // Access todos array from parsedObject

        for (let index = 0; index < items.length; index++) {
          const { taskName, description } = items[index];
          const embedding = await getEmbeddingsWithAI(taskName);
          await ctx.runMutation(api.subTodos.createASubTodo, {
            taskName,
            description,
            priority: 1,
            dueDate: new Date().getTime(),
            projectId,
            parentId,
            labelId: AI_LABEL_ID as Id<"labels">,
            embedding,
          });
        }
      } else {
        console.error("Failed to get valid JSON response from AI.");
      }
    } catch (error) {
      console.error("Error in suggestMissingSubItemsWithAi:", error);
    }
  },
});

export const getEmbeddingsWithAI = async (searchText: string) => {
  if (!apiKey) {
    throw new Error("Gemini AI Key is not defined");
  }
  // https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=$GOOGLE_API_KEY
  const req = {
    model: "models/text-embedding-004",
    content: {
      parts: [
        {
          text: searchText,
        },
      ],
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}
`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    }
  );

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`GeminiAI Error ${msg}`);
  }

  const json = await response.json();
  const vector = json.embedding.values;

  console.log(`Embedding of ${searchText} : ${vector.length} dimensions`);

  return vector;
};
