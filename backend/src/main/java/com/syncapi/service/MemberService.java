package com.syncapi.service;

import com.syncapi.model.Member;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MemberService {
    private final List<Member> members = new ArrayList<>();

    public Member signup(Member member) {
        for (Member m : members) {
            if (m.getEmail().equals(member.getEmail())) {
                throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
            }
        }
        member.setId(UUID.randomUUID().toString());
        members.add(member);
        return member;
    }

    public Member login(Member member) {
        for (Member m : members) {
            if (m.getEmail().equals(member.getEmail()) && m.getPassword().equals(member.getPassword())) {
                return m;
            }
        }
        throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
}
