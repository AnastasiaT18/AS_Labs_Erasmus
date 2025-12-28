import {NextResponse} from "next/server";
import {getDB} from "@/db";
import bcrypt from "bcryptjs";
import {getToken} from "@/app/api/auth/register/token";


function validateUserInput(email: string, password: string) {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Invalid email.";
    }
    if (!password || password.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/)) {
        return "Password must contain uppercase, lowercase, number, and special character.";
    }

    return null;

}


export async function POST(req: Request){

    try{
        const {email, password} = await req.json();

        //1. validate
        const validationError = validateUserInput(email, password);
        if (validationError) {
            return NextResponse.json({erorr: validationError}, {status: 400});
        }


        //2. if valid check in db
        const db = await getDB();
        if (db){
            console.log("DB opened.");
        }

        const existingUser: any = await db.get(
            "SELECT * FROM users WHERE email = ?",
            [email]);

        if (!existingUser) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 400 }
            );
        }

        //3. check pass
        const isValidPassword = await bcrypt.compare(password, existingUser.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 400 }
            );
        }

        //check active
        if (!existingUser.is_active) {
            return NextResponse.json({
                error: "Account not activated. Please check your email."
            }, { status: 403 });
        }

        //4. if all good, generate new session
        const sessionToken = await getToken();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // Insert new session
        await db.run(
            "INSERT INTO sessions(user_id, session_token, expires_at) VALUES (?, ?, ?)",
            [existingUser.id, sessionToken, expiresAt.toISOString()]
        );

        // 5. Create response + set cookie
        const response = NextResponse.json({ message: "Logged in successfully" });

        response.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });

        console.log(response);
        return response;


    }
    catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}