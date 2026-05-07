package Doctor_Letter.Doctor_Letter.member.service;

import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateResponseDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateRequestDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberUpdateResponseDto;
import Doctor_Letter.Doctor_Letter.member.repository.MemberRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
public class MemberServiceImpl implements MemberService {

    private MemberRepository memberRepository;
    private MemberCreateRequestDto createRequestDto;
    private MemberCreateResponseDto createResponseDto;
    private MemberUpdateRequestDto updateRequestDto;
    private MemberUpdateResponseDto updateResponseDto;

    @Transactional
    @Autowired
    public MemberCreateResponseDto createMember(MemberCreateRequestDto createRequestDto) {
        // 회원 생성 로직 구현
        // 예: memberRepository.save(new Member(requestDto));

        return createResponseDto; // 생성된 회원 정보를 반환
    }

    @Transactional
    @Autowired
    public MemberUpdateResponseDto updateResponseDto(MemberUpdateRequestDto updateRequestDto) {
        // 회원 정보 업데이트 로직 구현
        // 예: memberRepository.update(new Member(requestDto));

        return updateResponseDto; // 업데이트된 회원 정보를 반환
    }

    @Transactional
    @Autowired
    public MemberDeleteResponseDto deleteMember(MemberDeleteRequestDto deleteRequestDto) {
        // 회원 삭제 로직 구현
        // 예: memberRepository.deleteById(userId);
        return new MemberDeleteResponseDto("회원 삭제 완료"); // 삭제된 회원 ID를 반환
    }
}
