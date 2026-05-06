import { ManageRecordsPendingFlagRequests } from './ManageRecordsPendingFlagRequests'
import { ManageRecordsExportRecords } from './ManageRecordsExportRecords'
import { ManageRecordsPWDRecordsTable } from './ManageRecordsPWDRecordsTable'
import { ManageRecordsResourceDemandForecast } from './ManageRecordsResourceDemandForecast'

export function ManageRecordsPage() {
    return (
        <div className="space-y-6">
            <ManageRecordsPendingFlagRequests />
            <ManageRecordsExportRecords />
            <ManageRecordsPWDRecordsTable />
            <ManageRecordsResourceDemandForecast />
        </div>
    )
}
