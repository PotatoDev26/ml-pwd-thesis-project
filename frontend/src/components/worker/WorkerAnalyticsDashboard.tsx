import { Zap, CheckCircle2, AlertCircle, ClipboardCheck } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { StatCard } from '../shared/StatCard'

interface WorkerAnalyticsDashboardProps {
    setActivePage: Dispatch<SetStateAction<'analytics' | 'registration' | 'records' | 'view-records'>>
}

export function WorkerAnalyticsDashboard({ setActivePage }: WorkerAnalyticsDashboardProps) {
    return (
        <section className="space-y-6">
            {/* AI Trend Alert */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-orange-500 p-3 text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900">AI Trend Alert</h3>
                            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">LIVE</span>
                        </div>
                        <p className="mt-2 text-base text-slate-700">
                            <span className="font-semibold text-orange-600">15% increase</span> in mobility aid requests detected in Purok 3 this week. Consider expediting assessments for residents in this area.
                        </p>
                    </div>
                </div>
            </div>

            {/* New PWD Registration Button */}
            <button
                type="button"
                onClick={() => setActivePage('registration')}
                className="w-full rounded-2xl border-2 border-sky-400 bg-gradient-to-r from-sky-600 to-blue-600 p-8 text-center text-white shadow-lg transition hover:shadow-xl active:scale-95"
            >
                <div className="flex items-center justify-center gap-3">
                    <div className="rounded-lg bg-white/20 p-2">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">+ New PWD Registration</h2>
                        <p className="text-sm text-blue-100">Register a new citizen into the system</p>
                    </div>
                </div>
            </button>

            {/* Statistics Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Registered (Today)"
                    value="18"
                    icon={CheckCircle2}
                    bg="bg-emerald-50"
                />
                <StatCard
                    title="Pending Review"
                    value="7"
                    icon={AlertCircle}
                    bg="bg-amber-50"
                />
                <StatCard
                    title="Registered (This Week)"
                    value="42"
                    icon={ClipboardCheck}
                    bg="bg-blue-50"
                />
            </div>

            {/* Action Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">14</h3>
                    <p className="text-sm text-slate-600">Incomplete Profiles</p>
                    <p className="mt-2 text-xs text-slate-500">Registrations requiring additional information</p>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Review Now
                    </button>
                </article>

                <article className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">21</h3>
                    <p className="text-sm text-slate-600">Expired/Missing IDs</p>
                    <p className="mt-2 text-xs text-slate-500">Citizens needing ID renewal or generation</p>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                    >
                        Process IDs
                    </button>
                </article>

                <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">5</h3>
                    <p className="text-sm text-slate-600">Recent Verifications</p>
                    <p className="mt-2 text-xs text-slate-500">Generate QR IDs for verified citizens</p>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Generate QR
                    </button>
                </article>
            </div>

            {/* Quick Stats */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-800">Your Contributions</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-slate-600">Citizens Registered (This Month)</p>
                        <p className="mt-1 text-4xl font-bold text-sky-600">156</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600">Pending Approvals</p>
                        <p className="mt-1 text-4xl font-bold text-orange-600">12</p>
                    </div>
                </div>
            </article>
        </section>
    )
}
