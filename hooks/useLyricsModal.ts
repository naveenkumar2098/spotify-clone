import { create } from "zustand";

interface LyricsModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useLyricsModal = create<LyricsModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useLyricsModal;
