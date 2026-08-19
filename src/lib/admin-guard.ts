import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function requireAdmin() {
  const authed = await isAdminAuthenticated().catch(() => false);
  if (!authed) redirect("/admin/login");
}
