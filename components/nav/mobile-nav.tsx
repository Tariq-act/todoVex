"use client";

import { Hash, Menu, PlusIcon, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { primaryNavItems } from "@/utils";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

interface MyListTitleType {
  [key: string]: string;
}

function MobileNav() {
  const pathName = usePathname();

  const projectList = useQuery(api.projects.getProjects) ?? [];

  const LIST_OF_TITLE_IDS: MyListTitleType = {
    primary: "",
    projects: "My Projects",
  };

  const [navItems, setNavItems] = useState([...primaryNavItems]);

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
    <div className='flex flex-col'>
      <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-2 lg:h-[60px] lg:px-2'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='shrink-0 md:hidden'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col'>
            <UserProfile />
            <nav className='grid items-start text-sm font-medium lg:px-2'>
              {navItems.map(({ name, icon, link, id }, idx) => (
                <div key={idx}>
                  {id && (
                    <div
                      className={cn(
                        "flex items-center mt-6 mb-2",
                        id === "filters" && "my-0"
                      )}
                    >
                      <p className='flex flex-1 text-base'>
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
                            {/* <AddProjectDialog /> */}
                          </Dialog>
                        </>
                      )}
                    </div>
                  )}
                  <Link
                    key={idx}
                    href={link}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-1 py-2 transition-all hover:text-primary",
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
          </SheetContent>
        </Sheet>
        <div className='w-full flex-1'>
          <form>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search products...'
                className='w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3'
              />
            </div>
          </form>
        </div>
      </header>
    </div>
  );
}

export default MobileNav;
