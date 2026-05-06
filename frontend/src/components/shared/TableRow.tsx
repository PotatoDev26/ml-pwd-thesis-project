export function TableRow({
    id,
    name,
    sitio,
    disability,
    support,
    priority,
}: {
    id: string
    name: string
    sitio: string
    disability: string
    support: string
    priority: 'High' | 'Medium' | 'Low'
}) {
    return (
        <tr className="border-t border-slate-100">
            <td className="px-4 py-4 text-sm">{id}</td>
            <td className="px-4 py-4 text-sm">{name}</td>
            <td className="px-4 py-4 text-sm">{sitio}</td>
            <td className="px-4 py-4 text-sm">{disability}</td>
            <td className="px-4 py-4 text-sm">{support}</td>
            <td className="px-4 py-4 text-sm">
                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-lime-100 text-lime-700'
                        }`}
                >
                    {priority}
                </span>
            </td>
            <td className="px-4 py-4 text-sm">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Active</span>
            </td>
        </tr>
    )
}
