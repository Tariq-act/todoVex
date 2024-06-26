'use client';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { DropdownMenuContent } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { signOutAction } from '@/actions/auth-action';

const UserProfile = () => {
  const session = useSession();

  const imgUrl = session.data?.user?.image;
  const name = session.data?.user?.name;
  const email = session.data?.user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='hover:cursor-pointer'>
        <Button
          variant={'secondary'}
          className='flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white'
        >
          {imgUrl && (
            <Image
              src={imgUrl}
              width={24}
              height={24}
              alt={`${name} profile picture`}
              className='rounded-full'
            />
          )}
          <p className='truncate'>{email}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuItem className='lg:w-full px-28 flex items-center justify-center'>
          <form action={signOutAction}>
            <Button
              type='submit'
              variant={'ghost'}
              className='hover:text-primary'
            >
              Sign out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
