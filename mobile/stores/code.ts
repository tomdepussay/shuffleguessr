import { create } from 'zustand';

interface StoreState {
    code: string;
    setCode: (newCode: string) => void;
}

const useCode = create<StoreState>((set) => ({
    code: '',
    setCode: (newCode) => set({ code: newCode }),
}));

export default useCode;
