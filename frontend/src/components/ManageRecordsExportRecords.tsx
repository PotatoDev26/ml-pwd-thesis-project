import { Eye, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export function ManageRecordsExportRecords() {
    const handleExportToPdf = async () => {
        try {
            const target = document.getElementById('pwd-records-table-export')
            if (!target) {
                alert('Unable to export: records table was not found on the page.')
                return
            }

            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
                logging: false,
                onclone: (clonedDoc) => {
                    const exportTarget = clonedDoc.getElementById('pwd-records-table-export')
                    if (!exportTarget) return

                    // Set a solid white background for the container
                    exportTarget.style.backgroundColor = '#ffffff'

                    const allElements = exportTarget.querySelectorAll<HTMLElement>('*')
                    allElements.forEach((el) => {
                        // Force basic hex colors to bypass OKLCH parsing issues
                        el.style.color = '#0f172a'
                        el.style.backgroundColor = 'transparent'
                        el.style.borderColor = '#cbd5e1'

                        // Ensure table cells are readable
                        if (el.tagName === 'TH' || el.tagName === 'TD') {
                            el.style.backgroundColor = '#ffffff'
                            el.style.border = '1px solid #cbd5e1'
                        }
                    })
                },
            })

            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                alert('Unable to export: records table appears empty.')
                return
            }

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 10
            const usableWidth = pageWidth - margin * 2
            const usableHeight = pageHeight - margin * 2

            const imageWidth = usableWidth
            const imageHeight = (canvas.height * imageWidth) / canvas.width

            if (imageHeight <= usableHeight) {
                pdf.addImage(canvas, 'PNG', margin, margin, imageWidth, imageHeight, undefined, 'FAST')
            } else {
                const pageCanvas = document.createElement('canvas')
                const pageCtx = pageCanvas.getContext('2d')

                if (!pageCtx) {
                    alert('Failed to export PDF. Please try again.')
                    return
                }

                const sliceHeightPx = Math.floor((usableHeight * canvas.width) / imageWidth)
                pageCanvas.width = canvas.width

                let sourceY = 0
                let page = 0

                while (sourceY < canvas.height) {
                    const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - sourceY)
                    pageCanvas.height = currentSliceHeight

                    pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height)
                    pageCtx.drawImage(
                        canvas,
                        0,
                        sourceY,
                        canvas.width,
                        currentSliceHeight,
                        0,
                        0,
                        canvas.width,
                        currentSliceHeight
                    )

                    const renderHeight = (currentSliceHeight * imageWidth) / canvas.width

                    if (page > 0) pdf.addPage()
                    pdf.addImage(pageCanvas, 'PNG', margin, margin, imageWidth, renderHeight, undefined, 'FAST')

                    sourceY += currentSliceHeight
                    page += 1
                }
            }

            pdf.save(`pwd-records-${new Date().toISOString().slice(0, 10)}.pdf`)
        } catch (error) {
            console.error('Failed to export records PDF:', error)
            alert('Failed to export PDF. Please try again.')
        }
    }

    return (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-600 p-3 text-white">
                        <Eye className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">PWD Records Management</h2>
                        <p className="text-slate-600">Manage, update, and monitor all PWD citizen records</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleExportToPdf}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                    <Download className="h-4 w-4" />
                    Export Records
                </button>
            </div>
        </section>
    )
}
