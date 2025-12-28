import {NextResponse} from "next/server";
import {getDB} from "@/db";
import {getToken} from "@/app/api/auth/register/token";
import {transporter} from "@/app/api/auth/register/email";


function validateUserInput(email: string) {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Invalid email.";
    }
    return null;

}

export async function POST(req: Request) {

    try{

        console.log("hey,", req.body)
        const body = await req.json();
        const email = body.email;

        const validationError = validateUserInput(email)
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


        const resetToken = await getToken();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await db.run(
            "INSERT INTO passwordResetTokens(user_id, reset_token, expires_at) VALUES (?, ?, ?)",
            [existingUser.id, resetToken, expiresAt.toISOString()]
        );


        // Reset link
        const resetLink = `http://localhost:3000/resetPassword?token=${resetToken}`;
        console.log("Email is being sent...");

        console.log(process.env.EMAIL_USER)

        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your password",
            html: `
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
            `,
        });
        console.log("Email sent!");
        return NextResponse.json({ message: "If the email exists, a reset link was sent." });


    }
    catch(err: any){
        console.log(err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });

    }

}

