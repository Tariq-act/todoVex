import { DialogContent } from '../ui/dialog';

const AddTaskDialog = ({ taskName }: { taskName: string }) => {
  return <DialogContent>{taskName}</DialogContent>;
};

export default AddTaskDialog;
