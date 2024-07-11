"use client";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "convex/react";
import { Hash, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import UserProfile from "./user-profile";

interface MyListTitleType {
  [key: string]: string;
}

export default function SideBar() {
  const pathName = usePathname();

  const projectList = useQuery(api.projects.getProjects) ?? [];

  const LIST_OF_TITLE_IDS: MyListTitleType = {
    primary: "",
    projects: "My Projects",
  };

  const [navItems, setNavItems] = useState<
    {
      id?: string;
      name: string;
      link: string;
      icon: JSX.Element;
    }[]
  >([...primaryNavItems]);

  const renderItems = (projectList: Array<Doc<"projects">>) => {
    return projectList.map(({ name, _id }, idx) => {
      return {
        ...(idx === 0 && { id: "projects" }),
        name: name,
        link: `/loggedin/projects/${_id.toString()}`,
        icon: <Hash className='w-4 h-4' />,
      };
    });
  };

  useEffect(() => {
    if (projectList) {
      const projectItems = renderItems(projectList);
      const items = [...primaryNavItems, ...projectItems];
      setNavItems(items);
    }
  }, [projectList]);

  return (
    <div className='hidden border-r bg-muted/40 md:block'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 justify-between border-b p-1 lg:h-[60px] lg:px-2'>
          <UserProfile />
        </div>
        <div className='flex-1'>
          <nav className='grid items-start px-1 text-sm font-medium lg:px-4'>
            {navItems.map(({ name, icon, link, id }, idx) => (
              <div key={idx}>
                {id && (
                  <div
                    className={cn(
                      "flex items-center mt-6 mb-2",
                      id === "filters" && "my-0"
                    )}
                  >
                    <p className='flex flex-1 text-base px-2'>
                      {LIST_OF_TITLE_IDS[id]}
                    </p>
                    {LIST_OF_TITLE_IDS[id] === "My Projects" && (
                      <>
                        <Dialog>
                          <DialogTrigger id='closeDialog'>
                            <PlusIcon
                              className='h-5 w-5'
                              aria-label='Add a Project'
                            />
                          </DialogTrigger>

                          <DialogContent>Hii</DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                )}
                <Link
                  key={idx}
                  href={link}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathName === link
                      ? "active rounded-lg bg-primary/10 text-primary transition-all hover:text-primary"
                      : "text-foreground"
                  )}
                >
                  {icon} {name}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
