import { create } from "zustand";

type UploadStore = {
    uploadUrl: string;
    type: string;
    setType: (type: string) => void;
    setUploadUrl: (url: string) => void;
};

export const useUpload = create<UploadStore>((set) => ({
    uploadUrl: "",
    type: "",
    setType: (type) => set({ type }),
    setUploadUrl: (url) => set({ uploadUrl: url }),
}));
