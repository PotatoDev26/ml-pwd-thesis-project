import { Filter, UsersRound, CircleUserRound } from 'lucide-react'
import { Select } from './Select'
import { StatCard } from './StatCard'
import { ManageRecordsPWDRecordsTable } from './ManageRecordsPWDRecordsTable'

const pieSegments = [
    { label: 'Orthopedic (Physical) Disability', value: 27, color: '#3b82f6' },
    { label: 'Visual Disability', value: 21, color: '#8b5cf6' },
    { label: 'Hearing Disability', value: 15, color: '#ec4899' },
    { label: 'Learning Disability', value: 14, color: '#f59e0b' },
    { label: 'Mental Disability', value: 13, color: '#14b8a6' },
    { label: 'Multiple Disabilities', value: 10, color: '#22c55e' },
]

const ageGroups = [
    { label: '0-17', value: 3 },
    { label: '18-29', value: 5 },
    { label: '30-44', value: 7 },
    { label: '45-59', value: 8 },
    { label: '60-74', value: 5 },
    { label: '75+', value: 2 },
]

const purokSitioOptions = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Sitio A', 'Sitio B']

const disabilityTypeOptions = [
    'Orthopedic (Physical) Disability',
    'Visual Disability',
    'Hearing Disability',
    'Learning Disability',
    'Mental Disability',
    'Psychosocial Disability',
    'Disability due to Chronic Illness',
    'Communication Deficit',
    'Multiple Disabilities',
]

const dateRangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year', 'All time']

export function AnalyticsDashboard() {
    const gradient = `conic-gradient(${pieSegments
        .map((segment, index) => {
            const start = pieSegments.slice(0, index).reduce((sum, current) => sum + current.value, 0)
            const end = start + segment.value
            return `${segment.color} ${start}% ${end}%`
        })
        .join(', ')})`

    return (
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Filter size={18} className="text-indigo-600" /> Filters
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Select label="Purok/Sitio" value="All Purok/Sitio" options={purokSitioOptions} />
                    <Select label="Disability Type" value="All Types" options={disabilityTypeOptions} />
                    <Select label="Date Range" value="Last 30 days" options={dateRangeOptions} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <StatCard title="Registered Citizens" value="30" icon={UsersRound} bg="bg-blue-50" />
                <StatCard title="Active Support Programs" value="15 to 20" icon={CircleUserRound} bg="bg-emerald-50" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-base font-semibold text-slate-800">Distribution by Disability Type</h3>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="relative mx-auto h-48 w-48 rounded-full shadow-inner" style={{ background: gradient }}>
                            <div className="absolute inset-6 rounded-full bg-white" />
                        </div>
                        <ul className="space-y-3 text-sm">
                            {pieSegments.map((segment) => (
                                <li key={segment.label} className="group relative flex items-center gap-3 text-slate-600">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                                    <span>{segment.label}</span>
                                    <span className="invisible absolute left-0 top-6 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow transition group-hover:visible group-hover:opacity-100">
                                        {segment.value}% of registered PWD citizens
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-base font-semibold text-slate-800">PWD Citizens by Age</h3>
                    <div className="flex h-56 items-end gap-3 rounded-xl bg-slate-50 p-4">
                        {ageGroups.map((item) => (
                            <div key={item.label} className="group flex flex-1 flex-col items-center justify-end gap-2">
                                <div className="invisible rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:visible group-hover:opacity-100">
                                    {item.label}: {item.value} citizens
                                </div>
                                <div
                                    className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-blue-500 transition-all group-hover:from-violet-600 group-hover:to-blue-600"
                                    style={{ height: `${item.value * 15}px` }}
                                />
                                <p className="text-sm text-slate-600 font-medium">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
            <ManageRecordsPWDRecordsTable />
            {/* <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-slate-800">Citizen Registry</h3>
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        <Search size={16} />
                        <input className="bg-transparent outline-none text-base" placeholder="Search by name or ID..." />
                    </label>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700">
                            <tr>
                                {['Citizen ID', 'Name', 'Purok/Sitio', 'Disability Type', 'Support Services', 'Priority', 'Status'].map((head) => (
                                    <th key={head} className="px-4 py-4 text-sm font-semibold">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow
                                id="CIT001"
                                name="Sarah Johnson"
                                sitio="Purok 1"
                                disability="Orthopedic (Physical) Disability"
                                support="Mobility assistance program, Transport vouchers"
                                priority="High"
                            />
                            <TableRow
                                id="CIT002"
                                name="Michael Chen"
                                sitio="Purok 2"
                                disability="Visual Disability"
                                support="Guide dog program, Assistive technology"
                                priority="Medium"
                            />
                        </tbody>
                    </table>
                </div>
            </article> */}
        </section>
    )
}
