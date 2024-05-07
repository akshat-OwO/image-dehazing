import { create } from "zustand";

type UploadStore = {
    uploadUrl: string;
    setUploadUrl: (url: string) => void;
};

export const useUpload = create<UploadStore>((set) => ({
    uploadUrl: "",
    setUploadUrl: (url) => set({ uploadUrl: url }),
}));
