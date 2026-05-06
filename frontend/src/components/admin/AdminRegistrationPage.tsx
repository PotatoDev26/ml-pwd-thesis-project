import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Input } from '../shared/Input'
import { DateInput } from '../shared/DateInput'
import { Select } from '../shared/Select'
import { TextArea } from '../shared/TextArea'
import { FormSection } from '../shared/FormSection'
import { registerPWD } from '../../services/profileService'
import type { PWDProfile } from '../../services/profileService'

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']

const purokSitioOptions = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Sitio A', 'Sitio B']

const validIDTypeOptions = ['National ID (PhilSys)', 'Postal ID', "Driver's License", 'PhilHealth ID', 'PRC License', 'Passport', 'Senior Citizen Card']

const disabilityTypeOptions = [
    'Orthopedic (Physical) Disability',
    'Visual Disability',
    'Hearing Disability',
    'Learning Disability',
    'Mental Disability',
    'Psychosocial Disability',
    'Disability due to Chronic Illness',
    'Communication Deficit',
    'Multiple Disabilities',
    'Other',
]

const severityLevelOptions = ['Mild', 'Moderate', 'Severe', 'Profound']

const recommendationMap: Record<string, string[]> = {
    'Orthopedic (Physical) Disability': [
        'Mobility Device Assistance Program',
        'Physical Therapy Support Sessions',
        'Accessible Transportation Subsidy',
        'Home Accessibility Improvement Assistance',
    ],
    'Visual Disability': [
        'Braille Learning and Literacy Program',
        'Assistive Technology for Visual Support',
        'Orientation and Mobility Training',
        'Vision Rehabilitation Services',
    ],
    'Hearing Disability': [
        'Hearing Aid Support Program',
        'Sign Language Interpretation Services',
        'Cochlear Implant Assessment',
        'Healthcare Coverage Support',
    ],
    'Learning Disability': [
        'Special Education Support Program',
        'Learning Intervention and Tutoring Services',
        'School Inclusion Coordination',
        'Parent Guidance and Training Sessions',
    ],
    'Mental Disability': [
        'Psychiatric Consultation Assistance',
        'Medication and Treatment Support',
        'Community Mental Health Program',
        'Caregiver Skills Training',
    ],
    'Psychosocial Disability': [
        'Psychosocial Counseling Services',
        'Community-Based Support Group Program',
        'Stress Management and Coping Workshops',
        'Crisis Response Referral Support',
    ],
    'Disability due to Chronic Illness': [
        'Chronic Illness Management Program',
        'Regular Medical Monitoring Assistance',
        'Medication Subsidy Services',
        'Nutrition and Wellness Support',
    ],
    'Communication Deficit': [
        'Speech and Language Therapy Services',
        'Communication Skills Development Program',
        'Assistive Communication Device Support',
        'Family Communication Training',
    ],
    'Multiple Disabilities': [
        'Comprehensive Multidisciplinary Assessment',
        'Integrated Rehabilitation Services',
        'Priority Financial Assistance Program',
        'Case Management and Referral Coordination',
    ],
    Other: [
        'General Disability Support Program',
        'Social Welfare Case Assessment',
        'Community-Based Rehabilitation Services',
        'Financial Assistance Program',
    ],
}

const computePriorityLevel = (severityLevel: string): 'High' | 'Medium' | 'Low' | '' => {
    if (!severityLevel) return ''
    if (severityLevel === 'Profound' || severityLevel === 'Severe') return 'High'
    if (severityLevel === 'Moderate') return 'Medium'
    return 'Low'
}

const initialFormState: PWDProfile = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    phoneNumber: '',
    emailAddress: '',
    purokSitio: '',
    address: '',
    validIdType: '',
    disabilityType: '',
    severityLevel: '',
    dateOfDiagnosis: '',
    assistiveDevices: '',
    medicalConditions: '',
    otherMedicalConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    priorityLevel: '',
    supportRecommendations: '',
}

export function AdminRegistrationPage() {
    const [formData, setFormData] = useState<PWDProfile>(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const generatedRecommendations = useMemo(() => {
        if (!formData.disabilityType) return []
        return recommendationMap[formData.disabilityType] ?? recommendationMap.Other
    }, [formData.disabilityType])

    const generatedPriority = useMemo(
        () => computePriorityLevel(formData.severityLevel),
        [formData.severityLevel]
    )

    const handleGenerateRecommendations = () => {
        const recommendations = generatedRecommendations.join(' | ')
        setFormData((prev) => ({
            ...prev,
            priorityLevel: generatedPriority,
            supportRecommendations: recommendations,
        }))
    }

    const handleChange = (field: keyof PWDProfile, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === 'age' ? Number(value) || 0 : value,
        }))
    }

    const handleClear = () => {
        setFormData(initialFormState)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload: PWDProfile = {
                ...formData,
                priorityLevel: generatedPriority,
                supportRecommendations: generatedRecommendations.join(' | '),
            }
            await registerPWD(payload)
            alert('Profile saved successfully.')
            setFormData(initialFormState)
        } catch (error) {
            console.error('Error submitting profile:', error)
            alert('Failed to save profile. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800">
                    <Plus size={24} className="rounded bg-indigo-600 p-1 text-white" /> New Citizen Registration
                </h2>
                <p className="mt-2 text-base text-slate-600">Enter citizen information to create a new PWD profile.</p>
            </div>

            <FormSection title="Personal Information">
                <div className="grid gap-4 md:grid-cols-2">
                    <Input label="First Name *" placeholder="Enter first name" value={formData.firstName} onChange={(v) => handleChange('firstName', v)} />
                    <Input label="Last Name *" placeholder="Enter last name" value={formData.lastName} onChange={(v) => handleChange('lastName', v)} />
                    <DateInput label="Date of Birth *" placeholder="mm/dd/yyyy" value={formData.dateOfBirth} onChange={(v) => handleChange('dateOfBirth', v)} />
                    <Input label="Age *" placeholder="Enter age" value={formData.age ? String(formData.age) : ''} onChange={(v) => handleChange('age', v)} />
                    <Select label="Gender *" value={formData.gender} options={genderOptions} onChange={(v) => handleChange('gender', v)} />
                </div>
            </FormSection>

            <FormSection title="Contact Information">
                <div className="grid gap-4 md:grid-cols-2">
                    <Input label="Phone Number *" placeholder="+63 912 345 6789" value={formData.phoneNumber} onChange={(v) => handleChange('phoneNumber', v)} />
                    <Input label="Email Address" placeholder="email@example.com" value={formData.emailAddress} onChange={(v) => handleChange('emailAddress', v)} />
                    <Select label="Purok/Sitio *" value={formData.purokSitio} options={purokSitioOptions} onChange={(v) => handleChange('purokSitio', v)} />
                    <div />
                    <TextArea label="Full Address *" placeholder="Enter full address" value={formData.address} onChange={(v) => handleChange('address', v)} />
                </div>
            </FormSection>

            <FormSection title="Valid ID Information">
                <div className="grid gap-4 md:grid-cols-2">
                    <Select label="Philippine Valid ID Type *" value={formData.validIdType} options={validIDTypeOptions} onChange={(v) => handleChange('validIdType', v)} />
                </div>
            </FormSection>

            <FormSection title="Disability Information">
                <div className="grid gap-4 md:grid-cols-2">
                    <Select label="Disability Type *" value={formData.disabilityType} options={disabilityTypeOptions} onChange={(v) => handleChange('disabilityType', v)} />
                    <Select label="Severity Level *" value={formData.severityLevel} options={severityLevelOptions} onChange={(v) => handleChange('severityLevel', v)} />
                    <DateInput label="Date of Diagnosis" placeholder="mm/dd/yyyy" value={formData.dateOfDiagnosis} onChange={(v) => handleChange('dateOfDiagnosis', v)} />
                    <Input label="Assistive Devices" placeholder="e.g., Wheelchair, Hearing aid" value={formData.assistiveDevices} onChange={(v) => handleChange('assistiveDevices', v)} />
                    <TextArea label="Medical Conditions" placeholder="Primary medical conditions related to disability" value={formData.medicalConditions} onChange={(v) => handleChange('medicalConditions', v)} />
                    <TextArea label="Other Medical Conditions" placeholder="Additional medical conditions or comorbidities" value={formData.otherMedicalConditions} onChange={(v) => handleChange('otherMedicalConditions', v)} />
                </div>
            </FormSection>

            <FormSection title="AI-Powered Support Recommendations">
                <div className="space-y-4 rounded-xl border border-blue-100 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-medium text-slate-700">
                            Based on the disability profile, generate recommended support programs.
                        </p>
                        <button
                            type="button"
                            onClick={handleGenerateRecommendations}
                            className="rounded-xl bg-indigo-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
                        >
                            Generate Recommendations
                        </button>
                    </div>

                    {generatedRecommendations.length > 0 && (
                        <div className="grid gap-3 md:grid-cols-2">
                            {generatedRecommendations.map((item) => (
                                <div key={item} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">
                                    • {item}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            label="Priority Level"
                            placeholder="Auto-generated based on severity level"
                            value={generatedPriority}
                            onChange={() => { }}
                        />
                        <TextArea
                            label="Support Recommendations (Saved to DB)"
                            placeholder="Auto-generated recommendations"
                            value={generatedRecommendations.join(' | ')}
                            onChange={() => { }}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection title="Emergency Contact">
                <div className="grid gap-4 md:grid-cols-2">
                    <Input label="Contact Name *" placeholder="Full name" value={formData.emergencyContactName} onChange={(v) => handleChange('emergencyContactName', v)} />
                    <Input label="Contact Phone *" placeholder="+1 (555) 000-0000" value={formData.emergencyContactPhone} onChange={(v) => handleChange('emergencyContactPhone', v)} />
                </div>
            </FormSection>

            <FormSection title="Supporting Documents">
                <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Upload size={40} className="mb-3 text-slate-500" />
                    <p className="text-base text-slate-700 font-medium">Upload medical certificates or other supporting files</p>
                    <small className="mt-2 text-sm text-slate-600">PDF, JPG, PNG up to 10MB each</small>
                    <button
                        type="button"
                        className="mt-4 rounded-xl bg-indigo-700 px-6 py-3 text-base font-medium text-white transition hover:bg-indigo-800"
                    >
                        + Select Files
                    </button>
                </div>
            </FormSection>

            <div className="flex gap-3 border-t border-slate-200 pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-indigo-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-xl bg-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                    Clear Form
                </button>
            </div>
        </form>
    )
}
