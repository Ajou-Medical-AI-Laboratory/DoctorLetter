package Doctor_Letter.Doctor_Letter.member.control;

import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateResponseDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateResponseDto;
import Doctor_Letter.Doctor_Letter.member.service.MemberDeleteRequestDto;
import Doctor_Letter.Doctor_Letter.member.service.MemberDeleteResponseDto;
import Doctor_Letter.Doctor_Letter.member.service.MemberService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController("member")
@AllArgsConstructor
public class MemberControl {

    private final MemberService memberService;

    //member Create
    @PostMapping("/create")
    public MemberCreateResponseDto createMember(@RequestBody MemberCreateRequestDto createRequestDto) {
        return memberService.createMember(createRequestDto);
    }

    @DeleteMapping("/delete")
    public MemberDeleteResponseDto deleteMember(@RequestBody MemberDeleteRequestDto deleteRequestDto) {
        MemberDeleteResponseDto responseDto = memberService.deleteMember(deleteRequestDto);
        return responseDto;
    }

    @PatchMapping("/update")
    public MemberUpdateResponseDto updateMember(@RequestBody MemberUpdateRequestDto updateRequestDto) {
        return memberService.updateResponseDto(updateRequestDto);
    }

}
