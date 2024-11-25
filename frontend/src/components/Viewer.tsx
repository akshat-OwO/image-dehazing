import { useUpload } from "@/hooks/use-upload";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Viewer = () => {
    const { type, uploadUrl } = useUpload();

    return (
        uploadUrl.length > 0 && (
            <Card className="h-fit md:flex-1">
                <CardHeader>
                    <CardTitle>Dehazed Image/Video</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full rounded-lg">
                        {type === "image" ? (
                            <img
                                src={uploadUrl}
                                alt="Dehazed Image"
                                className="aspect-video w-full object-cover rounded-lg"
                            />
                        ) : (
                            <video src={uploadUrl} controls className="aspect-video w-full object-covert rounded-lg" />
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    );
};

export default Viewer;
