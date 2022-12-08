import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import ShortcutsModal from '@/components/shortcuts-modal';
import ContactModal from '@/components/contact-modal';

type ModalContextValue = {
  shortcutsModalHandler: (visible: boolean) => void;
  triggerContactModal: (visible: boolean) => void;
};
type ModalContextProps = PropsWithChildren<{}>;

export const ModalContext = createContext<ModalContextValue>({
  shortcutsModalHandler: () => {},
  triggerContactModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({
  children,
}: PropsWithChildren<ModalContextProps>) => {
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openShortcutsModal, setOpenShortcutsModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        shortcutsModalHandler: visible => {
          setOpenShortcutsModal(visible);
        },
        triggerContactModal: visible => {
          setOpenContactModal(visible);
        },
      }}
    >
      <ContactModal
        open={openContactModal}
        onClose={() => {
          setOpenContactModal(false);
        }}
      ></ContactModal>
      <ShortcutsModal
        open={openShortcutsModal}
        onClose={() => {
          setOpenShortcutsModal(false);
        }}
      ></ShortcutsModal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
