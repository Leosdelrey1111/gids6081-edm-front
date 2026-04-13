import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Divider, Button } from '@heroui/react';
import type { ReactNode } from 'react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmActionModal({ isOpen, onOpenChange, title, description, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }: ConfirmActionModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" radius="lg"
      classNames={{
        body: 'py-6',
        backdrop: 'blur !z-[59]',
        wrapper: '!z-[60]',
        closeButton: 'absolute top-4 right-4 bg-danger hover:bg-danger-400 text-white font-bold rounded-full',
      }}>
      <ModalContent className="rounded-2xl shadow-2xl">
        <ModalHeader className="flex items-center gap-2">{title}</ModalHeader>
        <Divider className="mb-2 mx-auto" />
        <ModalBody className="text-gray-700 dark:text-gray-300 text-center">
          {description}
        </ModalBody>
        <ModalFooter className="flex justify-end gap-3">
          <Button variant="solid" color="default" onPress={() => { onCancel(); onOpenChange(false); }}>{cancelText}</Button>
          <Button variant="solid" color="danger" onPress={() => { onConfirm(); onOpenChange(false); }}>{confirmText}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
