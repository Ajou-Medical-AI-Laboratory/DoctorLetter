package Doctor_Letter.Doctor_Letter.member.service;

import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateResponseDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateResponseDto;

public interface MemberService {

    MemberCreateResponseDto createMember(MemberCreateRequestDto createRequestDto);

    MemberUpdateResponseDto updateResponseDto(MemberUpdateRequestDto updateRequestDto);

    MemberDeleteResponseDto deleteMember(MemberDeleteRequestDto deleteRequestDto);
}
