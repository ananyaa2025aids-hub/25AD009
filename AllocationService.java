package com.example.demo.service;

import com.example.demo.exception.AllocationException;
import com.example.demo.exception.EmployeeNotFoundException;
import com.example.demo.exception.ProjectNotFoundException;
import com.example.demo.model.Allocation;
import com.example.demo.model.Employee;
import com.example.demo.model.Project;
import com.example.demo.repository.AllocationRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;

    public AllocationService(
            AllocationRepository allocationRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository) {

        this.allocationRepository = allocationRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
    }

    public List<Allocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public Allocation createAllocation(Allocation allocation) {

        if (allocation.getEmployee() == null ||
                allocation.getEmployee().getEmployeeId() == null) {

            throw new AllocationException("Employee ID is required.");
        }

        if (allocation.getProject() == null ||
                allocation.getProject().getProjectId() == null) {

            throw new AllocationException("Project ID is required.");
        }

        Employee employee = employeeRepository
                .findById(allocation.getEmployee().getEmployeeId())
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                allocation.getEmployee().getEmployeeId()));

        Project project = projectRepository
                .findById(allocation.getProject().getProjectId())
                .orElseThrow(() ->
                        new ProjectNotFoundException(
                                allocation.getProject().getProjectId()));

        double currentAllocation =
                allocationRepository
                        .findByEmployeeEmployeeId(employee.getEmployeeId())
                        .stream()
                        .filter(a ->
                                !"CANCELLED".equalsIgnoreCase(
                                        a.getAllocationStatus()))
                        .mapToDouble(Allocation::getAllocationPercentage)
                        .sum();

        double newAllocation =
                allocation.getAllocationPercentage();

        if (currentAllocation + newAllocation > 100) {

            throw new AllocationException(
                    "Employee allocation cannot exceed 100%. " +
                            "Current allocation: " + currentAllocation +
                            "%, requested: " + newAllocation + "%"
            );
        }

        allocation.setEmployee(employee);
        allocation.setProject(project);

        if (allocation.getAllocationStatus() == null) {
            allocation.setAllocationStatus("ACTIVE");
        }

        return allocationRepository.save(allocation);
    }

    // THIS IS THE METHOD YOUR CONTROLLER IS LOOKING FOR
    public List<Allocation> getEmployeeAllocations(Long employeeId) {
        return allocationRepository.findByEmployeeEmployeeId(employeeId);
    }

    public List<Allocation> getProjectAllocations(Long projectId) {
        return allocationRepository.findByProjectProjectId(projectId);
    }

    public void deleteAllocation(Long id) {

        if (!allocationRepository.existsById(id)) {
            throw new AllocationException(
                    "Allocation not found with ID: " + id);
        }

        allocationRepository.deleteById(id);
    }
}