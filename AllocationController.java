package com.example.demo.controller;

import com.example.demo.model.Allocation;
import com.example.demo.service.AllocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public List<Allocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @PostMapping
    public Allocation createAllocation(
            @RequestBody Allocation allocation) {

        return allocationService.createAllocation(allocation);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Allocation> getEmployeeAllocations(
            @PathVariable Long employeeId) {

        return allocationService.getEmployeeAllocations(employeeId);
    }

    @GetMapping("/project/{projectId}")
    public List<Allocation> getProjectAllocations(
            @PathVariable Long projectId) {

        return allocationService.getProjectAllocations(projectId);
    }

    @DeleteMapping("/{id}")
    public void deleteAllocation(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
    }
}