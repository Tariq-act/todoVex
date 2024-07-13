"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "../ui/use-toast";

export default function AddProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild id='closeDialog'>
        <PlusIcon className='h-5 w-5' aria-label='Add a Project' />
      </DialogTrigger>

      <AddProjectDialogContent />
    </Dialog>
  );
}

function AddProjectDialogContent() {
  const form = useForm({ defaultValues: { name: "" } });
  const router = useRouter();
  const { toast } = useToast();

  const createAProject = useMutation(api.projects.createAProject);

  const onSubmit = async ({ name }: any) => {
    const projectId = await createAProject({ name });
    if (projectId !== undefined) {
      toast({ title: "🚀 Successfully created a project!", duration: 3000 });
      form.reset({ name: "" });
      router.push(`/loggedin/projects/${projectId}`);
    }
  };

  return (
    <DialogContent className='max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right'>
      <DialogHeader className='w-full'>
        <DialogTitle>Add Project</DialogTitle>

        <DialogDescription>
          <Form {...form}>
            <>
              <form
                className='space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id='name'
                          type='text'
                          required
                          placeholder='Project name'
                          className='border-0 font-semibold text-lg'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button className='hover:bg-blue-600 px-4 w-full'>Add</Button>
              </form>
            </>
          </Form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
