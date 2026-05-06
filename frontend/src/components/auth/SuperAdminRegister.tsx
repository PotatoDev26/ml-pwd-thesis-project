import { Mail, Lock, Eye, EyeOff, User, Shield } from 'lucide-react'
import { useState } from 'react'
import { signUpUser } from '../../services/authService'

interface SuperAdminRegisterProps {
    onSuccess: () => void
    onCancel: () => void
}

export function SuperAdminRegister({ onSuccess, onCancel }: SuperAdminRegisterProps) {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'administrator' as 'administrator' | 'worker'
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validation
        if (!formData.displayName.trim()) {
            setError('Display name is required')
            return
        }
        if (!formData.email.trim()) {
            setError('Email is required')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format')
            return
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            await signUpUser(
                formData.email,
                formData.password,
                formData.displayName,
                formData.role
            )

            setSuccess(`User created successfully! ${formData.role === 'administrator' ? 'Administrator' : 'Social Welfare Worker'} can now log in.`)
            setFormData({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'administrator'
            })

            setTimeout(() => {
                onSuccess()
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to create user')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 px-8 py-10 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                        <Shield className="h-10 w-10 text-indigo-700" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Super Admin</h1>
                    <p className="mt-2 text-lg text-indigo-100">Register New User Account</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {error && (
                        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                            <p className="text-sm font-semibold text-red-800">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
                            <p className="text-sm font-semibold text-emerald-800">{success}</p>
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-lg font-semibold text-slate-800">Display Name</label>
                        <div className="flex items-center rounded-xl border-2 border-slate-300 bg-white px-3">
                            <User className="h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="e.g., John Doe"
                                value={formData.displayName}
                                onChange={(e) => handleChange('displayName', e.target.value)}
                                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-lg font-semibold text-slate-800">Email Address</label>
                        <div className="flex items-center rounded-xl border-2 border-slate-300 bg-white px-3">
                            <Mail className="h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="user@dasmarinas.gov.ph"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-lg font-semibold text-slate-800">User Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        >
                            <option value="administrator">Administrator</option>
                            <option value="worker">Social Welfare Worker</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-lg font-semibold text-slate-800">Password</label>
                        <div className="flex items-center rounded-xl border-2 border-slate-300 bg-white px-3">
                            <Lock className="h-5 w-5 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter a strong password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-lg font-semibold text-slate-800">Confirm Password</label>
                        <div className="flex items-center rounded-xl border-2 border-slate-300 bg-white px-3">
                            <Lock className="h-5 w-5 text-slate-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 border-t border-slate-200 pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-xl bg-indigo-700 px-6 py-3 text-lg font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? 'Creating Account...' : 'Create User Account'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 text-lg font-semibold text-slate-800 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
                        <p>This interface is for Super Admin use only.</p>
                        <p className="mt-1">Users will receive these credentials via secure email.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
