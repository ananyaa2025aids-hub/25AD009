package com.example.demo.service;

import com.example.demo.dto.EmployeeRecommendationDTO;
import com.example.demo.model.Employee;
import com.example.demo.model.EmployeeSkill;
import com.example.demo.model.ProjectSkillRequirement;
import com.example.demo.repository.AllocationRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.EmployeeSkillRepository;
import com.example.demo.repository.ProjectSkillRequirementRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final ProjectSkillRequirementRepository requirementRepository;
    private final AllocationRepository allocationRepository;

    public RecommendationService(
            EmployeeRepository employeeRepository,
            EmployeeSkillRepository employeeSkillRepository,
            ProjectSkillRequirementRepository requirementRepository,
            AllocationRepository allocationRepository) {

        this.employeeRepository = employeeRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.requirementRepository = requirementRepository;
        this.allocationRepository = allocationRepository;
    }

    public List<EmployeeRecommendationDTO> getRecommendations(Long projectId) {

        List<ProjectSkillRequirement> requirements =
                requirementRepository.findByProjectProjectId(projectId);

        List<Employee> employees =
                employeeRepository.findByActiveTrue();

        List<EmployeeRecommendationDTO> recommendations =
                new ArrayList<>();

        for (Employee employee : employees) {

            double currentAllocation =
                    allocationRepository
                            .findByEmployeeEmployeeId(employee.getEmployeeId())
                            .stream()
                            .filter(a ->
                                    !"CANCELLED".equalsIgnoreCase(
                                            a.getAllocationStatus()))
                            .mapToDouble(a -> a.getAllocationPercentage())
                            .sum();

            double availableCapacity =
                    employee.getAvailabilityCapacity() - currentAllocation;

            if (availableCapacity <= 0) {
                continue;
            }

            List<EmployeeSkill> employeeSkills =
                    employeeSkillRepository
                            .findByEmployeeEmployeeId(employee.getEmployeeId());

            double totalMatch = 0;

            if (!requirements.isEmpty()) {

                for (ProjectSkillRequirement requirement : requirements) {

                    int requiredLevel =
                            requirement.getRequiredProficiency();

                    int employeeLevel = 0;

                    for (EmployeeSkill employeeSkill : employeeSkills) {

                        if (employeeSkill.getSkill()
                                .getSkillId()
                                .equals(requirement.getSkill()
                                        .getSkillId())) {

                            employeeLevel =
                                    employeeSkill.getProficiencyLevel();

                            break;
                        }
                    }

                    double skillMatch;

                    if (employeeLevel >= requiredLevel) {
                        skillMatch = 100;
                    } else if (employeeLevel > 0) {
                        skillMatch =
                                ((double) employeeLevel / requiredLevel) * 100;
                    } else {
                        skillMatch = 0;
                    }

                    totalMatch += skillMatch;
                }

                totalMatch =
                        totalMatch / requirements.size();
            }

            recommendations.add(
                    new EmployeeRecommendationDTO(
                            employee.getEmployeeId(),
                            employee.getName(),
                            employee.getRole(),
                            availableCapacity,
                            Math.round(totalMatch * 100.0) / 100.0
                    )
            );
        }

        recommendations.sort(
                Comparator.comparing(
                        EmployeeRecommendationDTO::getMatchPercentage
                ).reversed()
        );

        return recommendations;
    }
}