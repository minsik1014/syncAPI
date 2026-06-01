package com.syncapi.controller;

import com.syncapi.model.Member;
import com.syncapi.service.MemberService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MemberService memberService;

    public AuthController(MemberService memberService) {
        this.memberService = memberService;
    }

    //회원가입
    @PostMapping("/signup")
    public Member signup(@RequestBody Member member){
        return memberService.signup(member);
    }

    //로그인
    @PostMapping("/login")
    public Member login(@RequestBody Member member){
        return memberService.login(member);
    }


}
