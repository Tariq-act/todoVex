import React from "react";
import Task from "./task";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useToast } from "../ui/use-toast";

export default function Todos({
  items,
  showDetails = false,
}: {
  items: Array<Doc<"todos">>;
  showDetails?: boolean;
}) {
  const { toast } = useToast();

  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ taskId: task._id });
    } else {
      toast({
        title: "✅ Task Completed",
        description: "You're a achiever",
        duration: 3000,
      });
      checkATodo({ taskId: task._id });
    }
  };

  return items?.map((task: Doc<"todos">, idx) => (
    <Task
      key={task._id}
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChangeTodo(task)}
      showDetails={showDetails}
    />
  ));
}
