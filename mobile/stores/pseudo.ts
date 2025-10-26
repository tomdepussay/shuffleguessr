import { create } from 'zustand';

interface StoreState {
    pseudo: string;
    setPseudo: (newPseudo: string) => void;
}

const usePseudo = create<StoreState>((set) => ({
    pseudo: '',
    setPseudo: (newPseudo) => set({ pseudo: newPseudo }),
}));

export default usePseudo;
