package com.example.demo.controller;

import com.example.demo.model.EmployeeSkill;
import com.example.demo.repository.EmployeeSkillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-skills")
public class EmployeeSkillController {

    private final EmployeeSkillRepository employeeSkillRepository;

    public EmployeeSkillController(
            EmployeeSkillRepository employeeSkillRepository) {
        this.employeeSkillRepository = employeeSkillRepository;
    }

    @GetMapping
    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillRepository.findAll();
    }

    @PostMapping
    public EmployeeSkill createEmployeeSkill(
            @RequestBody EmployeeSkill employeeSkill) {

        return employeeSkillRepository.save(employeeSkill);
    }
}