type SelectProps = {
    label: string
    value: string
    options?: string[]
    onChange?: (value: string) => void
}

export function Select({ label, value, options = [], onChange }: SelectProps) {
    return (
        <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            >
                <option value="" disabled>
                    Select an option
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    )
}
