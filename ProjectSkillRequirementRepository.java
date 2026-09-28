package com.example.demo.repository;

import com.example.demo.model.ProjectSkillRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectSkillRequirementRepository
        extends JpaRepository<ProjectSkillRequirement, Long> {

    List<ProjectSkillRequirement> findByProjectProjectId(Long projectId);
}