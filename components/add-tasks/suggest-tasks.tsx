import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export default function SuggestMissingTasks({
  projectId,
  isSubTask = false,
  taskName = "",
  description = "",
  parentId,
}: {
  projectId: Id<"projects">;
  isSubTask?: boolean;
  taskName?: string;
  description?: string;
  parentId: Id<"todos">;
}) {
  const { toast } = useToast();
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] =
    useState<boolean>(false);

  const suggestMissingTasks = useAction(
    api.openai.suggestMissingItemsWithAi || []
  );

  const suggestMissingSubTasks = useAction(
    api.openai.suggestMissingSubItemsWithAi || []
  );

  const handleMissingTask = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      await suggestMissingTasks({ projectId });
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
      toast({ title: "❗️ Issue OpenAI API", duration: 3000 });
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  const handleMissingSubTask = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      await suggestMissingSubTasks({
        projectId,
        taskName,
        description,
        parentId,
      });
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
      toast({ title: "❗️ Issue OpenAI API", duration: 3000 });
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={isSubTask ? handleMissingSubTask : handleMissingTask}
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
