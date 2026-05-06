import { useState } from 'react'
import { Flag, CheckCircle2, XCircle } from 'lucide-react'

type RequestType = 'delete request' | 'edit request'

interface FlagRequest {
    id: string
    type: RequestType
    recordId: string
    worker: string
    reason: string
    timestamp: string
}

const pendingRequests: FlagRequest[] = [
    {
        id: 'req-1',
        type: 'delete request',
        recordId: 'PWD-2026-003',
        worker: 'Juan Dela Cruz',
        reason: 'No reason provided',
        timestamp: '4/28/2026, 10:30 AM',
    },
    {
        id: 'req-2',
        type: 'edit request',
        recordId: 'PWD-2026-001',
        worker: 'Maria Garcia',
        reason: 'No reason provided',
        timestamp: '4/28/2026, 9:15 AM',
    },
]

export function ManageRecordsPendingFlagRequests() {
    const [showRequests, setShowRequests] = useState(true)

    return (
        <section className="rounded-xl border border-orange-300 bg-orange-50/20 p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-500 p-3 text-white">
                        <Flag className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Pending Flag Requests</h2>
                        <p className="text-slate-600">{pendingRequests.length} request(s) awaiting approval</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowRequests((prev) => !prev)}
                    className="rounded-lg border border-orange-500 bg-white px-4 py-2 font-semibold text-orange-600 hover:bg-orange-50"
                >
                    {showRequests ? 'Hide Requests' : 'Show Requests'}
                </button>
            </div>

            {showRequests ? (
                <div className="space-y-3">
                    {pendingRequests.map((request) => (
                        <article key={request.id} className="rounded-xl border border-orange-200 bg-white p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${request.type === 'delete request'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {request.type.toUpperCase()}
                                        </span>
                                        <span className="text-slate-700">
                                            Record: <strong>{request.recordId}</strong>
                                        </span>
                                    </div>
                                    <p className="text-slate-800">
                                        <strong>Worker:</strong> {request.worker}
                                    </p>
                                    <p className="text-slate-600">
                                        <strong>Reason:</strong> {request.reason}
                                    </p>
                                    <p className="mt-1 text-slate-500">{request.timestamp}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button type="button" className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </button>
                                    <button type="button" className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200">
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-orange-200 bg-white p-4 text-slate-600">
                    Requests are currently hidden.
                </div>
            )}
        </section>
    )
}
