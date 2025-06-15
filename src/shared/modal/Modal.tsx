    
import { Modal as MantineModal, Button } from "@mantine/core";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
}) {
  return (
    <MantineModal opened={isOpen} onClose={onClose} title={title} centered>
      <div className="p-4">{children}</div>
      {onConfirm && (
        <div className="flex justify-end space-x-2 p-4">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={onConfirm} color="blue">Confirm</Button>
        </div>
      )}
    </MantineModal>
  );
}
