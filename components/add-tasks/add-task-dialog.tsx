import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Task from "../todos/task";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { AddTaskWrapper } from "./add-task-button";
import SuggestMissingTasks from "./suggest-tasks";
import { useToast } from "../ui/use-toast";
format;

const AddTaskDialog = ({ data }: { data: Doc<"todos"> }) => {
  const { taskName, description, projectId, labelId, dueDate, priority, _id } =
    data;
  const { toast } = useToast();
  const project = useQuery(api.projects.getProjectByProjectId, { projectId });
  const label = useQuery(api.labels.getLabelByLabelId, { labelId });

  const inCompletedSubTodosByProject =
    useQuery(api.subTodos.inCompletedSubTodos, { parentId: _id }) ?? [];
  const completedSubTodosByProject =
    useQuery(api.subTodos.completedSubTodos, { parentId: _id }) ?? [];

  const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);
  const unCheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);
  const deleteATodoMutation = useMutation(api.todos.deleteATodo);

  const [todoDetails, setTodoDetails] = useState<
    Array<{ labelName: string; value: string; icon: React.ReactNode }>
  >([]);

  useEffect(() => {
    const data = [
      {
        labelName: "Project",
        value: project?.name || "",
        icon: <Hash className='w-4 h-4 text-primary' />,
      },
      {
        labelName: "Due Date",
        value: format(dueDate || new Date(), "MMM dd yyyy"),
        icon: <Calendar className='w-4 h-4 text-primary' />,
      },
      {
        labelName: "Priority",
        value: priority?.toString() || "",
        icon: <Flag className='w-4 h-4 text-primary' />,
      },
      {
        labelName: "Label",
        value: label?.name || "",
        icon: <Tag className='w-4 h-4 text-primary' />,
      },
    ];
    if (data) {
      setTodoDetails(data);
    }
  }, [dueDate, label?.name, priority, project]);

  const handleDeleteTodo = (e: any) => {
    e.preventDefault();
    const deletedId = deleteATodoMutation({ taskId: _id });
    if (deletedId !== undefined) {
      toast({ title: "🗑️ Successfully deleted", duration: 3000 });
    }
  };

  return (
    <DialogContent className='max-w-4xl h-4/5 lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right overflow-auto'>
      <DialogHeader className='w-full md:overflow-y-auto'>
        <DialogTitle>{taskName}</DialogTitle>
        <DialogDescription>
          <span className='my-2 capitalize'>{description}</span>
          <div className='flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0'>
            <span className='flex gap-1'>
              <ChevronDown className='w-5 h-5 text-primary' />
              <span className='font-bold flex text-sm text-gray-900'>
                Sub-tasks
              </span>
            </span>

            <div>
              <SuggestMissingTasks
                projectId={projectId}
                taskName={taskName}
                description={description}
                parentId={_id}
                isSubTask={true}
              />
            </div>
          </div>

          <div className='pl-4'>
            {inCompletedSubTodosByProject.map((task, idx) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    checkASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
            <div className='pb-4'>
              <AddTaskWrapper parentTask={data} />
            </div>
            {completedSubTodosByProject.map((task, idx) => {
              return (
                <Task
                  key={task._id}
                  data={task}
                  isCompleted={task.isCompleted}
                  handleOnChange={() =>
                    unCheckASubTodoMutation({ taskId: task._id })
                  }
                />
              );
            })}
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className='flex flex-col gap-2 bg-gray-100 md:w-1/2'>
        {todoDetails.map(({ labelName, value, icon }, idx) => (
          <div
            key={`${value}-${value}`}
            className='grid gap-2 p-4 border-b-2 w-full'
          >
            <Label className='flex items-start'>{labelName}</Label>
            <div className='flex text-center items-center justify-start gap-2 pb-2'>
              {icon}
              <span className='capitalize text-sm'>{value}</span>
            </div>
          </div>
        ))}
        <div className=' grid gap-2 p-4 w-full justify-end'>
          <form onSubmit={(e) => handleDeleteTodo(e)}>
            <button type='submit'>
              <Trash2 className='w-5 h-5 cursor-pointer' />
            </button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddTaskDialog;
