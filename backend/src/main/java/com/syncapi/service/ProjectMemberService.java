package com.syncapi.service;

import com.syncapi.dto.member.MemberInviteRequestDto;
import com.syncapi.dto.member.MemberResponseDto;
import com.syncapi.model.Project;
import com.syncapi.model.ProjectMember;
import com.syncapi.model.User;
import com.syncapi.repository.ProjectMemberRepository;
import com.syncapi.repository.ProjectRepository;
import com.syncapi.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectMemberService {
    private final ProjectMemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectMemberService(ProjectMemberRepository m, ProjectRepository p, UserRepository u) {
        this.memberRepository = m;
        this.projectRepository = p;
        this.userRepository = u;
    }

    // 프로젝트에 소속된 팀원 목록 조회
    public List<MemberResponseDto> getMembers(String projectId) {
        return memberRepository.findByProjectId(projectId).stream()
                .map(MemberResponseDto::from)
                .collect(Collectors.toList());
    }

    // 팀원 초대
    @Transactional
    public MemberResponseDto inviteUser(MemberInviteRequestDto request) {
        // 1. 프로젝트 존재 여부 확인
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다."));
        
        // 2. 가입된 유저인지 이메일로 검색
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일로 가입된 유저가 없습니다."));

        // 3. (옵션) 이미 초대된 유저인지 검사하는 로직을 나중에 추가할 수 있음

        // 4. 멤버 연결 및 저장
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.getRole())
                .build();

        return MemberResponseDto.from(memberRepository.save(member));
    }

    // 팀원 추방(삭제)
    @Transactional
    public void removeMember(String memberId) {
        ProjectMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 멤버입니다."));
        
        // OWNER(방장)는 추방될 수 없도록 방어 로직 추가
        if("OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("프로젝트 소유자는 추방할 수 없습니다.");
        }

        memberRepository.delete(member);
    }

    // 팀원 권한 수정
    @Transactional
    public MemberResponseDto updateRole(String memberId, String newRole) {
        ProjectMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 멤버입니다."));
        
        // OWNER(방장)의 권한은 강등할 수 없음
        if("OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("프로젝트 소유자의 권한은 변경할 수 없습니다.");
        }

        member.setRole(newRole);
        return MemberResponseDto.from(member);
    }
}
