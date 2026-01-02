import { redirect } from "next/navigation";
import {getAuthenticatedUser} from "@/app/lib/auth";

export default async function HomePage() {

    const user = await getAuthenticatedUser();

    if (!user) {
        console.log("not admin");
        redirect("/feed"); // guest → feed
    } else if (user.role === "admin") {
        redirect("/admin"); // admin → admin panel
    } else {
        redirect("/feed"); // regular user → feed
    }
}
