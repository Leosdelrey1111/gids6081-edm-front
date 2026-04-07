import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Divider } from '@heroui/react';
import type { ReactNode } from 'react';

interface GenericModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  customMaxWidth?: string;
  customBodyMaxHeight?: string;
  isClosable?: boolean;
}

export function GenericModal({
  isOpen, onOpenChange, title, body, footer,
  customMaxWidth, customBodyMaxHeight = 'max-h-[70vh]', isClosable = true,
}: GenericModalProps) {
  return (
    <Modal
      isDismissable={false}
      hideCloseButton={!isClosable}
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top"
      scrollBehavior="inside"
      radius="lg"
      classNames={{
        body: `py-4 overflow-y-auto ${customBodyMaxHeight}`,
        backdrop: 'blur !z-[50]',
        wrapper: '!z-[50] px-2 sm:px-4',
        base: '!z-[50]',
        closeButton: 'absolute top-4 right-4 bg-danger hover:bg-danger-400 text-white font-bold rounded-full z-[60]',
      }}
    >
      <ModalContent
        className={`rounded-2xl shadow-2xl w-full ${customMaxWidth || 'max-w-[98vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-5xl'} max-h-[95vh] overflow-hidden`}
      >
        <>
          <ModalHeader className="flex flex-col text-base sm:text-lg">{title}</ModalHeader>
          <Divider className="mb-2 mx-auto" />
          <ModalBody className="space-y-5 text-sm sm:text-base">{body}</ModalBody>
          <ModalFooter>{footer}</ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
