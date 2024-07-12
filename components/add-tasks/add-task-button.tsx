import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddTaskInline from "./add-task-inline";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const AddTaskWrapper = ({
  parentTask,
  projectId,
}: {
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) => {
  const [showAdTask, setShowAddTask] = useState<boolean>(false);

  return showAdTask ? (
    <AddTaskInline
      onClick={() => setShowAddTask(false)}
      parentTask={parentTask}
      projectId={projectId}
    />
  ) : (
    <AddTaskButton
      onClick={() => setShowAddTask(true)}
      title={parentTask?._id ? "Add sub-task" : "Add task"}
    />
  );
};

export default function AddTaskButton({
  onClick,
  title,
}: {
  onClick: () => void;
  title: string;
}) {
  return (
    <button className='pl-2 flex mt-2 flex-1' onClick={onClick}>
      <div className='flex flex-col items-center justify-center gap-1 text-center'>
        <div className='flex items-center gap-2 justify-center'>
          <Plus className='w-4 h-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white' />
          <h3 className='text-base font-light tracking-tight text-foreground/70'>
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
}
