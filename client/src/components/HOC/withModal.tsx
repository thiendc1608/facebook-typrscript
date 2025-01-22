import React, { useEffect, useState, ComponentType } from "react";

interface WithModalProps {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const withModal = <P extends object>(Component: ComponentType<P>) => {
  const ModalWrapper: React.FC<WithModalProps & P> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Điều khiển cuộn trang
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden"; // Disable scroll
      } else {
        document.body.style.overflow = "auto"; // Re-enable scroll
      }

      return () => {
        document.body.style.overflow = "auto"; // Cleanup
      };
    }, [isModalOpen]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
      <Component
        {...(props as P)}
        isModalOpen={isModalOpen}
        openModal={openModal}
        closeModal={closeModal}
      />
    );
  };

  return ModalWrapper;
};

export default withModal;
