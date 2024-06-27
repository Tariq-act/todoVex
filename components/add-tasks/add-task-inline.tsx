import React from 'react';
import { Button } from '../ui/button';

export default function AddTaskInline({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <div className='flex gap-3 self-end'>
        <Button
          className='bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300'
          variant={'outline'}
          onClick={onClick}
        >
          Cancel
        </Button>
        <Button className='px-6' type='submit'>
          Add task
        </Button>
      </div>
    </div>
  );
}
