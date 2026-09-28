package com.example.demo.dto;

public class SkillGapDTO {

    private String skillName;
    private Integer requiredProficiency;
    private Integer availableProficiency;
    private String status;

    public SkillGapDTO() {
    }

    public SkillGapDTO(
            String skillName,
            Integer requiredProficiency,
            Integer availableProficiency,
            String status) {

        this.skillName = skillName;
        this.requiredProficiency = requiredProficiency;
        this.availableProficiency = availableProficiency;
        this.status = status;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(Integer requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public Integer getAvailableProficiency() {
        return availableProficiency;
    }

    public void setAvailableProficiency(Integer availableProficiency) {
        this.availableProficiency = availableProficiency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}