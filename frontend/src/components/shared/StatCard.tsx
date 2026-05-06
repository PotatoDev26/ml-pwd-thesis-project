import { type LucideIcon } from 'lucide-react'

export function StatCard({
    title,
    value,
    icon: Icon,
    bg,
}: {
    title: string
    value: string
    icon: LucideIcon
    bg: string
}) {
    return (
        <article className={`rounded-2xl border border-slate-200 p-6 shadow-sm ${bg}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <h3 className="mt-2 text-4xl font-bold text-slate-800">{value}</h3>
                </div>
                <span className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
                    <Icon size={24} />
                </span>
            </div>
        </article>
    )
}
