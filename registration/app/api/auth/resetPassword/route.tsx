import {getDB} from "@/db";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";



function validateUserInput(password: string) {
    if (!password || password.length < 8) {
        return "Password must be at least 8 characters.";
    }

    if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/)) {
        return "Password must contain uppercase, lowercase, number, and special character.";
    }

    return null;
}

export async function POST(req: Request){

    const db = await getDB();


    try {
        const {token, password} = await req.json();

        //perform token validation, check in db
        if (!token) {
            return NextResponse.json(
                { error: "Token missing" },
                { status: 400 }
            );        }
        console.log("Looking into db reset pass table...");

        const dbToken = await db.get(
            `SELECT * FROM passwordResetTokens 
             WHERE reset_token = ? 
               AND used = 0 
               AND expires_at > CURRENT_TIMESTAMP`,
            [token]
        );

        if (!dbToken) {
            return new Response("Invalid or expired token.", {status: 400});
        }

        //perform pass validation
        const validationError = validateUserInput(password)

        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            );
        }
        //check with password conirmation is done in front end

        //confirm pass
        const hashed = await bcrypt.hash(password, 12);
        console.log("New password hashed");

        //update in db

        const update = await db.run(
            "UPDATE passwordResetTokens SET used = 1 WHERE id = ?",
            [dbToken.id]
        );

        const passUpdate = await db.run(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [hashed, dbToken.user_id]
        );

        return NextResponse.json({
            message: "Password successfully reset. You can now log in."
        });


    }catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }

    finally {
        await db.close();
    }


}