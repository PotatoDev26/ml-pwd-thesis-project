import axios from 'axios';

export interface PWDProfile {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    phoneNumber: string;
    emailAddress: string;
    purokSitio: string;
    address: string;
    validIdType: string;
    disabilityType: string;
    severityLevel: string;
    dateOfDiagnosis: string;
    assistiveDevices: string;
    medicalConditions: string;
    otherMedicalConditions: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    priorityLevel: 'High' | 'Medium' | 'Low' | '';
    supportRecommendations: string;
}

export interface PWDProfileRecord extends PWDProfile {
    id?: string;
}

const API_URL = 'http://localhost:8080/api/profiles';

export const registerPWD = async (formData: PWDProfile) => {
    try {
        const response = await axios.post(API_URL, formData);
        return response.data;
    } catch (error) {
        console.error("Error saving profile:", error);
        throw error;
    }
};

export const fetchPWDProfiles = async (): Promise<PWDProfileRecord[]> => {
    try {
        const response = await axios.get<PWDProfileRecord[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching profiles:", error);
        throw error;
    }
};
