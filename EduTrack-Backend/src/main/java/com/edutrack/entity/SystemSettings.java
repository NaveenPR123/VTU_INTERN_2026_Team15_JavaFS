package com.edutrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {

    @Id
    private Integer id = 1; // singleton row

    private String activeYear;
    private String activeSemester;
    private boolean maintenanceMode;
    private boolean registrationOpen;
}
