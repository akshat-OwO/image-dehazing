import * as z from "zod";

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4"];

export const uploadSchema = z.object({
    type: z.enum(["image", "video"]),
    model: z.enum(["dcp", "ffa"]),
    file: z
        .custom<File>((file) => (file instanceof File ? true : false), "Upload an image first!")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png, .mp4 and .webp formats are supported.",
        ),
});
