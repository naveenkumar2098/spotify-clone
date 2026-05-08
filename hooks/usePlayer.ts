import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    shuffledIds: string[];
    activeId?: string;
    repeatMode: number; // 0: off, 1: all, 2: one
    isShuffle: boolean;
    setId: (id: string) => void;
    setIds: (ids: string[]) => void;
    setRepeatMode: (mode: number) => void;
    toggleShuffle: () => void;
    reorderQueue: (oldIndex: number, newIndex: number) => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
    ids: [],
    shuffledIds: [],
    activeId: undefined,
    repeatMode: 0,
    isShuffle: false,
    setId: (id: string) => set({activeId: id}),
    setIds: (ids: string[]) => {
        const { isShuffle, activeId } = get();
        if (isShuffle) {
            const otherIds = ids.filter(id => id.toString() !== activeId?.toString());
            const shuffledOtherIds = otherIds.sort(() => Math.random() - 0.5);
            const newShuffledIds = activeId ? [activeId, ...shuffledOtherIds] : shuffledOtherIds;
            set({ ids: ids, shuffledIds: newShuffledIds });
        } else {
            set({ ids: ids, shuffledIds: [] });
        }
    },
    setRepeatMode: (mode: number) => set({repeatMode: mode}),
    toggleShuffle: () => {
        const { isShuffle, ids, activeId } = get();
        if (isShuffle) {
            set({ isShuffle: false, shuffledIds: [] });
        } else {
            const otherIds = ids.filter(id => id.toString() !== activeId?.toString());
            const shuffledOtherIds = otherIds.sort(() => Math.random() - 0.5);
            const newShuffledIds = activeId ? [activeId, ...shuffledOtherIds] : shuffledOtherIds;
            set({ isShuffle: true, shuffledIds: newShuffledIds });
        }
    },
    reorderQueue: (oldIndex: number, newIndex: number) => {
        const { isShuffle, ids, shuffledIds } = get();
        const listToUpdate = isShuffle ? [...shuffledIds] : [...ids];
        const [movedItem] = listToUpdate.splice(oldIndex, 1);
        listToUpdate.splice(newIndex, 0, movedItem);

        if (isShuffle) {
            set({ shuffledIds: listToUpdate });
        } else {
            set({ ids: listToUpdate });
        }
    },
    reset: () => set({ ids: [], shuffledIds: [], activeId: undefined, repeatMode: 0, isShuffle: false })
}));

export default usePlayer;