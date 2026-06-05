package com.syncapi.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberInviteRequestDto {
    private String projectId;
    private String email; // 초대할 사람의 이메일
    private String role;  // 부여할 권한 (예: "EDITOR", "VIEWER")
}
