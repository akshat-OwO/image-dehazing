import { Image } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardHeader, CardTitle } from "./ui/card";
const Navbar = () => {
    return (
        <Card>
            <CardHeader className="flex-row justify-center items-center gap-1.5">
                <Avatar>
                    <AvatarImage src="/logo.jpeg" />
                    <AvatarFallback>
                        <Image className="size-5" />
                    </AvatarFallback>
                </Avatar>
                <CardTitle>Dehaze Image</CardTitle>
            </CardHeader>
        </Card>
    );
};

export default Navbar;
