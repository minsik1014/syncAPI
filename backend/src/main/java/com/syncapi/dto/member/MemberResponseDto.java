package com.syncapi.dto.member;

import com.syncapi.model.ProjectMember;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberResponseDto {
    private String id;
    private String projectId;
    private String userId;
    private String email;
    private String name;
    private String role;

    public static MemberResponseDto from(ProjectMember member) {
        return MemberResponseDto.builder()
                .id(member.getId())
                .projectId(member.getProject().getId())
                .userId(member.getUser().getId())
                .email(member.getUser().getEmail())
                .name(member.getUser().getName())
                .role(member.getRole())
                .build();
    }
}
