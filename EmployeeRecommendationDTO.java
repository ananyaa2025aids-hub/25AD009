package com.example.demo.dto;

public class EmployeeRecommendationDTO {

    private Long employeeId;
    private String employeeName;
    private String role;
    private Double availableCapacity;
    private Double matchPercentage;

    public EmployeeRecommendationDTO() {
    }

    public EmployeeRecommendationDTO(
            Long employeeId,
            String employeeName,
            String role,
            Double availableCapacity,
            Double matchPercentage) {

        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.role = role;
        this.availableCapacity = availableCapacity;
        this.matchPercentage = matchPercentage;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Double getAvailableCapacity() {
        return availableCapacity;
    }

    public void setAvailableCapacity(Double availableCapacity) {
        this.availableCapacity = availableCapacity;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }
}