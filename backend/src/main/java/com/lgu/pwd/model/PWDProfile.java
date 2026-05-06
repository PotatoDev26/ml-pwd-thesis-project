package com.lgu.pwd.model;

public class PWDProfile {

    // Personal Information
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private Integer age;
    private String gender;

    // Contact Information
    private String phoneNumber;
    private String emailAddress;
    private String purokSitio;
    private String address;

    // Valid ID Information
    private String validIdType;

    // Disability Information
    private String disabilityType;
    private String severityLevel;
    private String dateOfDiagnosis;
    private String assistiveDevices;
    private String medicalConditions;
    private String otherMedicalConditions;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactPhone;

    //AI-Generated Information
    private String priorityLevel;
    private String supportRecommendations;


    public PWDProfile() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getPurokSitio() {
        return purokSitio;
    }

    public void setPurokSitio(String purokSitio) {
        this.purokSitio = purokSitio;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getValidIdType() {
        return validIdType;
    }

    public void setValidIdType(String validIdType) {
        this.validIdType = validIdType;
    }

    public String getDisabilityType() {
        return disabilityType;
    }

    public void setDisabilityType(String disabilityType) {
        this.disabilityType = disabilityType;
    }

    public String getSeverityLevel() {
        return severityLevel;
    }

    public void setSeverityLevel(String severityLevel) {
        this.severityLevel = severityLevel;
    }

    public String getDateOfDiagnosis() {
        return dateOfDiagnosis;
    }

    public void setDateOfDiagnosis(String dateOfDiagnosis) {
        this.dateOfDiagnosis = dateOfDiagnosis;
    }

    public String getAssistiveDevices() {
        return assistiveDevices;
    }

    public void setAssistiveDevices(String assistiveDevices) {
        this.assistiveDevices = assistiveDevices;
    }

    public String getMedicalConditions() {
        return medicalConditions;
    }

    public void setMedicalConditions(String medicalConditions) {
        this.medicalConditions = medicalConditions;
    }

    public String getOtherMedicalConditions() {
        return otherMedicalConditions;
    }

    public void setOtherMedicalConditions(String otherMedicalConditions) {
        this.otherMedicalConditions = otherMedicalConditions;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }

    public String getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(String priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public String getSupportRecommendations() {
        return supportRecommendations;
    }

    public void setSupportRecommendations(String supportRecommendations) {
        this.supportRecommendations = supportRecommendations;
    }
}
