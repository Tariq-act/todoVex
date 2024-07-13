import { EllipsisIcon, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";

export default function DeleteProject({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const form = useForm({ defaultValues: { name: "" } });
  const router = useRouter();
  const { toast } = useToast();

  const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

  const onSubmit = async () => {
    if (projectId == GET_STARTED_PROJECT_ID) {
      toast({
        title: "🤗 Just a reminder",
        description: "System projects are protected from deletion.",
        duration: 3000,
      });
    } else {
      const deleteTaskId = await deleteProject({ projectId });
      if (deleteTaskId !== undefined) {
        toast({ title: "🗑️ Successfully deleted a project!", duration: 3000 });
        form.reset({ name: "" });
        router.push(`/loggedin/projects`);
      }
    }
  };

  const handleDeleteProject = () => {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className='w-5 h-5 text-foreground cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='w-40 lg:w-56'>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <button className='flex gap-2'>
              <Trash2 className='w-5 h-5 rotate-45 text-foreground/40' /> Delete
              Project
            </button>
          </form>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
