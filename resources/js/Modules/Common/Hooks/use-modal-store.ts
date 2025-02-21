import { create } from "zustand";

interface ModalState {
    modals: Record<string, boolean>;
    openModal: (modalName: string) => void;
    closeModal: (modalName: string) => void;
}

const useModalStore = create<ModalState>((set) => ({
    modals: {},
    openModal: (modalName) => set((state) => ({ modals: { ...state.modals, [modalName]: true } })),
    closeModal: (modalName) => set((state) => ({ modals: { ...state.modals, [modalName]: false } })),
}));

export default useModalStore;
