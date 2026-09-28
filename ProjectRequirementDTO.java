package com.example.demo.dto;

public class ProjectRequirementDTO {

    private Long skillId;
    private Integer requiredProficiency;
    private Double requiredPercentage;

    public ProjectRequirementDTO() {
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public Integer getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(Integer requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public Double getRequiredPercentage() {
        return requiredPercentage;
    }

    public void setRequiredPercentage(Double requiredPercentage) {
        this.requiredPercentage = requiredPercentage;
    }
}