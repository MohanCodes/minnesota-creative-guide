import { isAdminAuthenticated } from "./actions";
import AdminLoginForm from "./login-form";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return <AdminLoginForm />;
  }

  return <>{children}</>;
}
