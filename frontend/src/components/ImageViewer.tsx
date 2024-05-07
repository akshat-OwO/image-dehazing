import { useUpload } from "@/hooks/use-upload";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ImageViewer = () => {
    const { uploadUrl } = useUpload();

    return (
        uploadUrl.length > 0 && (
            <Card className="h-fit md:flex-1">
                <CardHeader>
                    <CardTitle>Dehazed Image</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full rounded-lg">
                        <img
                            src={uploadUrl}
                            alt="Dehazed Image"
                            className="aspect-video w-full object-cover rounded-lg"
                        />
                    </div>
                </CardContent>
            </Card>
        )
    );
};

export default ImageViewer;
