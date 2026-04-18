package com.edutrack.repository;

import com.edutrack.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Integer> {
}
