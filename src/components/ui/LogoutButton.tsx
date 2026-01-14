"use client";

import { logout } from "../../app/(auth)/actions";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => await logout()}
      className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      Logout
    </button>
  );
}
