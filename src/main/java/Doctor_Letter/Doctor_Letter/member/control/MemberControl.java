package Doctor_Letter.Doctor_Letter.member.control;

import Doctor_Letter.Doctor_Letter.member.dto.*;
import Doctor_Letter.Doctor_Letter.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MemberControl {

    private final MemberService memberService;

    @PostMapping("/create")
    public MemberCreateResponseDto createMember(@RequestBody MemberCreateRequestDto createRequestDto) {
        return memberService.createMember(createRequestDto);
    }

    @GetMapping("/me")
    public FindMemberResponseDto getMember(Authentication authentication) {
        return memberService.getMember(authentication.getName());
    }

    @DeleteMapping("/delete")
    public MemberDeleteResponseDto deleteMember(Authentication authentication,
                                                @RequestBody MemberDeleteRequestDto deleteRequestDto) {
        return memberService.deleteMember(authentication.getName(), deleteRequestDto);
    }

    @PatchMapping("/update")
    public MemberUpdateResponseDto updateMember(Authentication authentication,
                                                @RequestBody MemberUpdateRequestDto updateRequestDto) {
        return memberService.updateResponseDto(authentication.getName(), updateRequestDto);
    }
}
