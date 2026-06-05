package com.syncapi.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDto {
    private String email;
    private String name;
    private String password;
}
