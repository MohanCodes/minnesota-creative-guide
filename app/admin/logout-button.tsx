"use client";

import { logoutAdmin } from "./actions";

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
    >
      Logout
    </button>
  );
}
