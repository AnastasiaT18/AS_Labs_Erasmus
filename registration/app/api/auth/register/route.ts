import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getToken } from "./token";
import { transporter } from "./email";
import {getDB} from "@/db";


function validateUserInput(username: string, email: string, password: string) {
    if (!username || username.length < 2) {
        return "Username must be at least 2 characters.";
    }

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

export async function POST(req: Request) {
    try {

        const { username, email, password } = await req.json();

        const validationError = validateUserInput(username, email, password);

        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const db = await getDB();
        console.log("DB opened.");

        const existingUser: any = await db.get(
                "SELECT * FROM users WHERE email = ? OR name = ?",
                [email, username]);

        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 500 });
        }


        const hashed = await bcrypt.hash(password, 12);
        console.log("Password hashed");

        const activationToken = getToken();
        console.log("Token received.");


        // Insert new user
        await db.run(
            "INSERT INTO users(name, email, password_hash, activation_token) VALUES (?, ?, ?, ?)",
            [username, email, hashed, activationToken]
        );

        console.log("User inserted, token generated.");

        // Activation link
        const activationLink = `http://localhost:3000/api/auth/activate?token=${activationToken}`;
        console.log("Email is being sent...");

        console.log(process.env.EMAIL_USER)

        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Activate your account",
            html: `
                <h2>Welcome, ${username}!</h2>
                <p>Click the link below to activate your account:</p>
                <a href="${activationLink}">Activate account</a>
            `,
        });
        console.log("Email sent!");



        return NextResponse.json({
            message: "Registration successful! Check your email.",
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

