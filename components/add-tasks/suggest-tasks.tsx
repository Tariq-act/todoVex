import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function SuggestMissingTasks({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] =
    useState<boolean>(false);

  const suggestMissingTasks = useAction(
    api.openai.suggestMissingItemsWithAi || []
  );

  const handleMissingTask = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      await suggestMissingTasks({ projectId });
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={handleMissingTask}
      >
        {isLoadingSuggestMissingTasks ? (
          <div className='flex gap-2'>
            Loading Tasks (AI) <Loader className='w-5 h-5 text-primary' />{" "}
          </div>
        ) : (
          "Suggest Missing Task (AI) 🧑‍💻"
        )}
      </Button>
    </>
  );
}
