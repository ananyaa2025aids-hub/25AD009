package com.example.demo.service;

import com.example.demo.exception.ProjectNotFoundException;
import com.example.demo.model.Project;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {

        Project project = getProjectById(id);

        project.setProjectName(updatedProject.getProjectName());
        project.setDescription(updatedProject.getDescription());
        project.setStatus(updatedProject.getStatus());
        project.setRequiredCapacity(updatedProject.getRequiredCapacity());

        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {

        Project project = getProjectById(id);

        projectRepository.delete(project);
    }
}