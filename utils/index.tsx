import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavItems = [
  {
    id: "primary",
    name: "Inbox",
    link: "/loggedin",
    icon: <Inbox className='w-4 h-4' />,
  },
  {
    id: "primary",
    name: "Today",
    link: "/loggedin/today",
    icon: <Calendar className='w-4 h-4' />,
  },
  {
    id: "primary",
    name: "Upcoming",
    link: "/loggedin/upcoming",
    icon: <CalendarDays className='w-4 h-4' />,
  },
  {
    id: "primary",
    name: "Filters & Labels",
    link: "/loggedin/filter-labels",
    icon: <Grid2X2 className='w-4 h-4' />,
  },
];

export const GET_STARTED_PROJECT_ID = "k17e1wz01cv29vx25v2q30yy5s6vs2v6";
