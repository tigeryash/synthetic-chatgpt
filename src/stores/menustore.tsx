import { create } from "zustand";

type MenuStore = {
  click: boolean;
  toggleClick: () => void;
};

export const useMenuStore = create<MenuStore>((set) => ({
  click: false,
  toggleClick: () => set((state) => ({ click: !state.click })),
}));
