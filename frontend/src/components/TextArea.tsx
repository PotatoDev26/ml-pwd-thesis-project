type TextAreaProps = {
    label: string
    placeholder: string
    value?: string
    onChange?: (value: string) => void
}

export function TextArea({ label, placeholder, value, onChange }: TextAreaProps) {
    return (
        <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <textarea
                rows={4}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
        </label>
    )
}
