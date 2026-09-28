package com.example.demo.service;

import com.example.demo.model.Skill;
import com.example.demo.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Skill not found with ID: " + id));
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {

        Skill skill = getSkillById(id);

        skill.setSkillName(updatedSkill.getSkillName());
        skill.setCategory(updatedSkill.getCategory());

        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id) {

        Skill skill = getSkillById(id);

        skillRepository.delete(skill);
    }
}