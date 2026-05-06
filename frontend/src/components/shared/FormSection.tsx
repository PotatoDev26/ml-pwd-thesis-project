import { type ReactNode } from 'react'

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {children}
        </section>
    )
}
