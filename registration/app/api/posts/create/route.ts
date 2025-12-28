import {getAuthenticatedUser} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import { writeFile } from "fs/promises";
import {getDB} from "@/db";
import path from "path";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

export async function POST(req: Request){

    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();
    const content = formData.get("content")?.toString();
    const image = formData.get("image") as File | null;

    if (!content || content.length > 500) {
        return NextResponse.json(
            { error: "Invalid content" },
            { status: 400 }
        );
    }

    let imagePath: string | null = null;

    if (image) {
        if (!ALLOWED_TYPES.includes(image.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        if (image.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File too large" }, { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = image.type === "image/png" ? ".png" : ".jpg";
        const filename = crypto.randomUUID() + ext;

        const uploadDir = path.join(process.cwd(), "public/uploads");
        const fullPath = path.join(uploadDir, filename);

        await writeFile(fullPath, buffer);
        imagePath = `/uploads/${filename}`;
    }

    //if ok then post
    const db = await getDB();

    try {
        await db.run(
            "INSERT INTO posts(user_id, content, image_path) VALUES (?, ?, ?)",
            [user.id, content, imagePath || null],
        );
    }finally {
        await db.close();
    }
    return NextResponse.json({ message: "Post created" });

}