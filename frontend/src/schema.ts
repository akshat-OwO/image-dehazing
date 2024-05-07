import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const uploadSchema = z.object({
    image: z
        .custom<File>(
            (file) => (file instanceof File ? true : false),
            "Upload an image first!"
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
});
