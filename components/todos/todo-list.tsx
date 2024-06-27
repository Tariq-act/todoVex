'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

import CompletedTodos from './completed-todos';
import Todos from './todos';

export default function TodoList() {
  const todos = useQuery(api.todos.get) ?? [];
  const completedTodos = useQuery(api.todos.completedTodos) ?? [];
  const inCompletedTodos = useQuery(api.todos.inCompletedTodos) ?? [];
  const totalTodos = useQuery(api.todos.totalTodos) ?? 0;

  if (
    todos === undefined ||
    completedTodos === undefined ||
    inCompletedTodos === undefined
  ) {
    <p>Loading...</p>;
  }

  return (
    <div className='lg:px-40'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold md:text-2xl'>Inbox</h1>
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <Todos items={inCompletedTodos} />
      </div>
      <div className='flex flex-col gap-1 py-4'>
        <Todos items={completedTodos} />
      </div>

      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}
