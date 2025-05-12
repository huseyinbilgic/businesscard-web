import React, { useState, useImperativeHandle, forwardRef, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';

export interface GeneralModalRef {
  open: () => void;
  close: () => void;
}

interface GeneralModalProps {
  title: string;
  children: ReactNode;
}

const GeneralModal = forwardRef<GeneralModalRef, GeneralModalProps>(({ title, children }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
    close: () => setShow(false),
  }));

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
});

GeneralModal.displayName = 'GeneralModal';

export default GeneralModal;
