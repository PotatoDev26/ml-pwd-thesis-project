import { TrendingUp, Package } from 'lucide-react'

interface ResourceForecastItem {
    resource: string
    currentDemand: number
    projectedDemand: number
    currentStock: number
    coveragePercent: number
    status: 'ADEQUATE' | 'MODERATE' | 'CRITICAL'
}

const forecasts: ResourceForecastItem[] = [
    {
        resource: 'Standard Wheelchairs',
        currentDemand: 6,
        projectedDemand: 8,
        currentStock: 4,
        coveragePercent: 50,
        status: 'MODERATE',
    },
    {
        resource: 'White Canes',
        currentDemand: 4,
        projectedDemand: 5,
        currentStock: 7,
        coveragePercent: 140,
        status: 'ADEQUATE',
    },
    {
        resource: 'Hearing Aid Batteries',
        currentDemand: 8,
        projectedDemand: 10,
        currentStock: 3,
        coveragePercent: 30,
        status: 'CRITICAL',
    },
]

const statusClassMap: Record<ResourceForecastItem['status'], string> = {
    ADEQUATE: 'bg-emerald-100 text-emerald-700',
    MODERATE: 'bg-amber-100 text-amber-700',
    CRITICAL: 'bg-red-100 text-red-700',
}

const coverageBarColor = (status: ResourceForecastItem['status']) => {
    if (status === 'CRITICAL') return 'bg-red-500'
    if (status === 'MODERATE') return 'bg-amber-500'
    return 'bg-emerald-500'
}

export function ManageRecordsResourceDemandForecast() {
    return (
        <section className="rounded-xl border border-blue-100 bg-white p-4 md:p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-600 p-3 text-white">
                    <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Resource Demand Forecast</h2>
                    <p className="text-slate-600">Predictive analysis based on registered PWD population</p>
                </div>
            </div>

            <div className="space-y-4">
                {forecasts.map((item) => (
                    <article key={item.resource} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                                <Package className="h-4 w-4 text-slate-500" />
                                {item.resource}
                            </h3>
                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClassMap[item.status]}`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="mb-3 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                            <p>
                                Current Demand
                                <br />
                                <strong className="text-2xl text-slate-900">{item.currentDemand}</strong>
                            </p>
                            <p>
                                Projected (3mo)
                                <br />
                                <strong className="text-2xl text-blue-600">{item.projectedDemand}</strong>
                            </p>
                            <p>
                                Current Stock
                                <br />
                                <strong className="text-2xl text-violet-600">{item.currentStock}</strong>
                            </p>
                        </div>

                        <div>
                            <div className="mb-1 h-2 w-full rounded-full bg-slate-200">
                                <div
                                    className={`h-2 rounded-full ${coverageBarColor(item.status)}`}
                                    style={{ width: `${Math.min(item.coveragePercent, 100)}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                                <span>Stock Coverage</span>
                                <strong>{item.coveragePercent}%</strong>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-800">
                <strong>Recommendation:</strong> Prioritize procurement of Hearing Aid Batteries and Standard Wheelchairs
                to meet projected demand.
            </div>
        </section>
    )
}
