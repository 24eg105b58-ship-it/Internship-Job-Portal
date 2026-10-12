package com.internshipportal.dto.response;

import com.internshipportal.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    private String phoneNumber;
    private String profileSummary;
    private LocalDateTime createdAt;
}
