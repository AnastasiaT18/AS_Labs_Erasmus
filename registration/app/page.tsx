import { redirect } from "next/navigation";
import {getAuthenticatedUser} from "@/app/lib/auth";

export default async function HomePage() {

    const user = await getAuthenticatedUser();

    if (!user) {
        redirect("/feed");
    }

    if (user.role === "admin") {
        redirect("/admin");
    }

    redirect("/feed/");


}
