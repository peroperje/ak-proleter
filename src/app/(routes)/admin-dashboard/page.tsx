import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
    const session = await auth()

    // High-level server-side check for routing
    if (session?.user?.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Welcome, {session.user.name}. You are logged in as an <strong>{session.user.role}</strong>.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">User Management</h3>
                    <p className="text-sm mt-2">Manage all registered users and their roles.</p>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl">
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Event Logs</h3>
                    <p className="text-sm mt-2">View system-wide activity logs and audit trails.</p>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Settings</h3>
                    <p className="text-sm mt-2">Configure system-wide parameters and API keys.</p>
                </div>
            </div>
        </div>
    )
}
