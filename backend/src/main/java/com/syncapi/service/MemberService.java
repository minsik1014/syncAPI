package com.syncapi.service;

import com.syncapi.model.Member;
import com.syncapi.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 1. 회원가입 (JPA 버전)
    public Member signup(Member member) {
        // DB에 쿼리를 날려 이메일 중복 검사
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // DB에 INSERT 쿼리 전송
        return memberRepository.save(member);
    }

    // 2. 로그인 (JPA 버전 - 더 이상 직접 사용 안함, Spring Security가 대신 처리)
    public Member login(Member member) {
        Member findMember = memberRepository.findByEmail(member.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));
        
        if (!findMember.getPassword().equals(member.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        
        return findMember;
    }

    // 3. 이메일로 회원 조회
    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }
}
