import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-level authorization guard: verifies session and admin_users table
  const user = await requireAdmin();

  return (
    <AdminShell user={{ email: user.email }}>
      {children}
    </AdminShell>
  );
}
