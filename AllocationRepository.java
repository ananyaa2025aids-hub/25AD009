package com.example.demo.repository;

import com.example.demo.model.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {

    List<Allocation> findByEmployeeEmployeeId(Long employeeId);

    List<Allocation> findByProjectProjectId(Long projectId);
}