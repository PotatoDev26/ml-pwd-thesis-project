import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Eye } from 'lucide-react'
import { fetchPWDProfiles } from '../../services/profileService'
import type { PWDProfileRecord } from '../../services/profileService'

interface RecordItem {
    pwdId: string
    name: string
    age: number
    purokSitio: string
    disabilityType: string
    priority: 'High' | 'Medium' | 'Low'
    status: 'Active' | 'Pending'
}

const priorityClassMap: Record<RecordItem['priority'], string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
}

const statusClassMap: Record<RecordItem['status'], string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
}

const toPriority = (value: string): RecordItem['priority'] => {
    if (value === 'High' || value === 'Medium' || value === 'Low') return value
    return 'Low'
}

const toStatus = (priority: RecordItem['priority']): RecordItem['status'] => {
    return priority === 'High' ? 'Pending' : 'Active'
}

const mapProfileToRecord = (profile: PWDProfileRecord, index: number): RecordItem => {
    const priority = toPriority(profile.priorityLevel || '')
    return {
        pwdId: profile.id ? `PWD-${profile.id.slice(0, 8).toUpperCase()}` : `PWD-${String(index + 1).padStart(4, '0')}`,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'N/A',
        age: Number(profile.age || 0),
        purokSitio: profile.purokSitio || 'N/A',
        disabilityType: profile.disabilityType || 'N/A',
        priority,
        status: toStatus(priority),
    }
}

export function WorkerViewRecordsPage() {
    const [records, setRecords] = useState<RecordItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const profiles = await fetchPWDProfiles()
                const mapped = profiles.map(mapProfileToRecord)
                setRecords(mapped)
            } catch (error) {
                console.error('Failed to fetch profile records:', error)
                setRecords([])
            }
        }

        loadProfiles()
    }, [])

    const filteredRecords = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return records
        return records.filter(
            (record) =>
                record.pwdId.toLowerCase().includes(term) ||
                record.name.toLowerCase().includes(term)
        )
    }, [records, searchTerm])

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
            <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-6">
                <h2 className="text-2xl font-semibold text-slate-800">View PWD Records</h2>
                <p className="mt-2 text-base text-slate-600">View and search registered PWD citizen records in your area.</p>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-blue-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by PWD ID or Name..."
                        className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-600"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
            </div>

            <p className="mb-3 text-sm text-slate-600">
                Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> records
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-800">
                            <th className="px-3 py-3 font-semibold">PWD ID</th>
                            <th className="px-3 py-3 font-semibold">Name</th>
                            <th className="px-3 py-3 font-semibold">Age</th>
                            <th className="px-3 py-3 font-semibold">Purok/Sitio</th>
                            <th className="px-3 py-3 font-semibold">Disability Type</th>
                            <th className="px-3 py-3 font-semibold">Priority</th>
                            <th className="px-3 py-3 font-semibold">Status</th>
                            <th className="px-3 py-3 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record) => (
                            <tr key={record.pwdId} className="border-b border-slate-100 text-slate-700">
                                <td className="px-3 py-4 font-semibold text-slate-900">{record.pwdId}</td>
                                <td className="px-3 py-4">{record.name}</td>
                                <td className="px-3 py-4">{record.age}</td>
                                <td className="px-3 py-4">{record.purokSitio}</td>
                                <td className="px-3 py-4">{record.disabilityType}</td>
                                <td className="px-3 py-4">
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityClassMap[record.priority]}`}>
                                        {record.priority}
                                    </span>
                                </td>
                                <td className="px-3 py-4">
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassMap[record.status]}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-3 py-4">
                                    <button type="button" className="text-blue-600 hover:text-blue-700" aria-label="View record">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
