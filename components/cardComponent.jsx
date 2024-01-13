import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function CardComponent({ setBase64Image, Base64Image, fileref, number }) {
    const ImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setBase64Image(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }
    return (
        <Card className="w-[350px] m-3">
            <CardHeader>
                <CardTitle>Upload Image {number}</CardTitle>
                <CardDescription>Choose images to spot the difference  .</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        {Base64Image && <img style={{ height: "200px", width: "auto", margin: "auto" }} src={Base64Image} alt='' />}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Picture</Label>
                            <Input onChange={ImageUpload} id="picture" type="file" accept="image/*" ref={fileref} />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default CardComponent
