import { Bell } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex min-h-[72px] items-center justify-between bg-gradient-to-r from-indigo-800 to-blue-600 px-6 text-white shadow-md">
            <div>
                <h1 className="text-3xl font-bold">PWD Profiling Dashboard</h1>
                <p className="text-sm text-blue-100">Citizen Registry & Analytics System</p>
            </div>
            <button
                type="button"
                className="relative rounded-full bg-white/10 p-3 transition hover:bg-white/20"
            >
                <Bell size={24} />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-xs font-bold">
                    2
                </span>
            </button>
        </header>
    )
}
