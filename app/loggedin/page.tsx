import { signInAction } from '@/actions/auth-action';
import SideBar from '@/components/nav/side-bar';
import Tasks from '@/components/todovex/tasks';
import UserProfile from '@/components/todovex/user-profile';

export default function Home() {
  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <SideBar />
      <div className='flex flex-col'>
        <main className='flex flex-1 flex-col gap-4 p-4 lg:px-8'>
          <h1>Todovex</h1>
          <UserProfile />
          <Tasks />
        </main>
      </div>
    </div>
  );
}
