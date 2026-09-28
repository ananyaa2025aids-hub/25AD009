package com.example.demo.controller;

import com.example.demo.dto.EmployeeRecommendationDTO;
import com.example.demo.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping("/{projectId}/recommendations")
    public List<EmployeeRecommendationDTO> getRecommendations(
            @PathVariable Long projectId) {

        return recommendationService
                .getRecommendations(projectId);
    }
}