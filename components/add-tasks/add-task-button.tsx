import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import AddTaskInline from './add-task-inline';

export const AddTaskWrapper = () => {
  const [showAdTask, setShowAddTask] = useState<boolean>(false);

  return showAdTask ? (
    <AddTaskInline onClick={() => setShowAddTask(false)} />
  ) : (
    <AddTaskButton onClick={() => setShowAddTask(true)} />
  );
};

export default function AddTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <button className='pl-2 flex mt-2 flex-1' onClick={onClick}>
      <div className='flex flex-col items-center justify-center gap-1 text-center'>
        <div className='flex items-center gap-2 justify-center'>
          <Plus className='w-4 h-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white' />
          <h3 className='text-base font-light tracking-tight text-foreground/70'>
            Add Task
          </h3>
        </div>
      </div>
    </button>
  );
}
