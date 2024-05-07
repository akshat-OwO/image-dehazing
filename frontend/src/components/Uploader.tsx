import { useUpload } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { uploadSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Image, Loader } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form } from "./ui/form";

const Uploader = () => {
    const [preview, setPreview] = useState<string | null>(null);

    const { setUploadUrl } = useUpload();

    const form = useForm<z.infer<typeof uploadSchema>>({
        resolver: zodResolver(uploadSchema),
    });

    const { mutate, isPending, isSuccess } = useMutation({
        mutationKey: ["upload"],
        mutationFn: async (formData: FormData) => {
            const response = await axios.post(
                "https://image-dehazing-wg25.onrender.com/",
                formData,
                { responseType: "blob" }
            );
            return response;
        },
        onSuccess: (data) => {
            const blob = data.data;
            const imageData = URL.createObjectURL(blob);
            setUploadUrl(imageData);
        },
    });

    const onSubmit = (values: z.infer<typeof uploadSchema>) => {
        const formData = new FormData();
        formData.append("image", values.image);
        mutate(formData);
    };

    return (
        <Card className="h-fit md:flex-1">
            <CardHeader>
                <CardTitle>Upload Hazy Image</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Dropzone
                            multiple={false}
                            accept={{
                                "image/*": [".jpeg", ".png", ".webp", ".jpg"],
                            }}
                            onDrop={(acceptedFiles) => {
                                form.setValue("image", acceptedFiles[0]);
                                const fileReader = new FileReader();
                                fileReader.readAsDataURL(acceptedFiles[0]);
                                fileReader.onload = () => {
                                    setPreview(fileReader.result as string);
                                };
                            }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div
                                    {...getRootProps()}
                                    className={cn(
                                        "border-2 h-fit w-full my-4 border-dashed border-border rounded-lg",
                                        {
                                            "border-red-500":
                                                !!form.formState.errors.image,
                                        }
                                    )}
                                >
                                    {preview && (
                                        <div className="h-full w-full p-2 rounded-lg">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="aspect-video w-full object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    {!preview && (
                                        <div className="h-64 w-full flex flex-col justify-center items-center gap-2">
                                            <Image className="size-5" />
                                            <h3>
                                                <span className="font-medium">
                                                    Drag n Drop
                                                </span>{" "}
                                                or{" "}
                                                <span className="font-medium">
                                                    Click to Upload
                                                </span>
                                            </h3>
                                        </div>
                                    )}
                                    <input
                                        {...getInputProps}
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </Dropzone>
                        <p className="text-red-500 mb-2">
                            {form.formState.errors.image?.message}
                        </p>
                        <Button className="w-full gap-2">
                            {isPending && (
                                <Loader className="size-5 animate-spin" />
                            )}
                            {isSuccess && <Check className="size-5" />}
                            {isPending ? "Uploading..." : "Upload"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default Uploader;
