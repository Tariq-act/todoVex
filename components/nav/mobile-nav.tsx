"use client";

import { Hash, Menu, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { primaryNavItems } from "@/utils";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "convex/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchForm from "./search-form";
import UserProfile from "./user-profile";

import todovexLogo from "@/public/logo/todovex.svg";

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
        <div className='flex items-center md:justify-between w-full gap-1 md:gap-2 py-2'>
          <div className='lg:flex-1'>
            <Link href={"/loggedin/projects"}>
              <p className='text-sm font-semibold text-foreground/70 w-24'>
                / My Projects
              </p>
            </Link>
          </div>
          <div className='place-content-center w-full flex-1'>
            <SearchForm />
          </div>
          <div className='place-content-center w-12 h-12 lg:w-16 lg:h-16'>
            <Image alt='logo' src={todovexLogo} />
          </div>
        </div>
      </header>
    </div>
  );
}

export default MobileNav;
