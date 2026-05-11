package Doctor_Letter.Doctor_Letter.member.service;

import Doctor_Letter.Doctor_Letter.member.dto.*;

public interface MemberService {

    MemberCreateResponseDto createMember(MemberCreateRequestDto createRequestDto);

    FindMemberResponseDto getMember(String userId);

    MemberUpdateResponseDto updateResponseDto(String userId, MemberUpdateRequestDto updateRequestDto);

    MemberDeleteResponseDto deleteMember(String userId, MemberDeleteRequestDto deleteRequestDto);
}
