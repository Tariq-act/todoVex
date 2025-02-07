"use client";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/utils";
import { useQuery } from "convex/react";
import { Hash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddProjectDialog from "../projects/add-project-dialog";
import UserProfile from "./user-profile";

interface MyListTitleType {
  [key: string]: string;
}

export default function SideBar() {
  const pathName = usePathname();

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const projectItems = renderItems(projectList);
    const items = [...primaryNavItems, ...projectItems];

    // Compare the current navItems with the new items
    if (JSON.stringify(navItems) !== JSON.stringify(items)) {
      setNavItems(items);
    }
  }, [projectList, navItems]);

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
                      "flex items-center  mb-2",
                      id === "filters" && "my-0",
                      LIST_OF_TITLE_IDS[id] === "My Projects" && "mt-6"
                    )}
                  >
                    <p className='flex flex-1 text-base'>
                      {LIST_OF_TITLE_IDS[id]}
                    </p>
                    {LIST_OF_TITLE_IDS[id] === "My Projects" && (
                      <AddProjectDialog />
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
