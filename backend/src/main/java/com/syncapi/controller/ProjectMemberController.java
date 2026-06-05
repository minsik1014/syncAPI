package com.syncapi.controller;

import com.syncapi.dto.member.MemberInviteRequestDto;
import com.syncapi.dto.member.MemberResponseDto;
import com.syncapi.service.ProjectMemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class ProjectMemberController {
    private final ProjectMemberService memberService;

    public ProjectMemberController(ProjectMemberService memberService) {
        this.memberService = memberService;
    }

    // GET /api/members?projectId=xxx
    @GetMapping
    public List<MemberResponseDto> getMembers(@RequestParam String projectId) {
        return memberService.getMembers(projectId);
    }

    // POST /api/members/invite
    @PostMapping("/invite")
    public MemberResponseDto invite(@RequestBody MemberInviteRequestDto request) {
        return memberService.inviteUser(request);
    }

    // DELETE /api/members/{memberId} - 멤버 추방
    @DeleteMapping("/{memberId}")
    public void removeMember(@PathVariable String memberId) {
        memberService.removeMember(memberId);
    }
}
