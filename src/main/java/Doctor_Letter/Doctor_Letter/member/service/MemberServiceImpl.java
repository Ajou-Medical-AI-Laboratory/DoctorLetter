package Doctor_Letter.Doctor_Letter.member.service;

import Doctor_Letter.Doctor_Letter.auth.password.PasswordPolicyValidator;
import Doctor_Letter.Doctor_Letter.member.domain.Member;
import Doctor_Letter.Doctor_Letter.member.dto.*;
import Doctor_Letter.Doctor_Letter.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public MemberCreateResponseDto createMember(MemberCreateRequestDto createRequestDto) {
        PasswordPolicyValidator.validate(createRequestDto.getPassword());

        Member member = Member.builder()
                .userId(createRequestDto.getUserId())
                .password(passwordEncoder.encode(createRequestDto.getPassword()))
                .sex(createRequestDto.getSex())
                .name(createRequestDto.getName())
                .age(createRequestDto.getAge())
                .build();

        Member saved = memberRepository.save(member);
        return new MemberCreateResponseDto(saved.getUserId());
    }

    @Override
    @Transactional
    public FindMemberResponseDto getMember(String userId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        return new FindMemberResponseDto(
                member.getUserId(),
                member.getName(),
                member.getAge(),
                member.getSex(),
                member.getSpecificity_disease()
        );
    }

    @Override
    @Transactional
    public MemberUpdateResponseDto updateResponseDto(String userId, MemberUpdateRequestDto updateRequestDto) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        if (!passwordEncoder.matches(updateRequestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        boolean hasSpecificity = updateRequestDto.getSpecificity_disease() != null
                && !updateRequestDto.getSpecificity_disease().isEmpty();
        boolean hasNewPassword = updateRequestDto.getNew_password() != null
                && !updateRequestDto.getNew_password().isEmpty();

        if (!hasSpecificity && !hasNewPassword) {
            throw new IllegalArgumentException("변경할 항목이 없습니다.");
        }

        if (hasSpecificity) {
            member.changeSpecificityDisease(updateRequestDto.getSpecificity_disease());
        }

        if (hasNewPassword) {
            PasswordPolicyValidator.validate(updateRequestDto.getNew_password());
            if (passwordEncoder.matches(updateRequestDto.getNew_password(), member.getPassword())) {
                throw new IllegalArgumentException("이전 비밀번호와 같을 수 없습니다.");
            }
            member.changePassword(passwordEncoder.encode(updateRequestDto.getNew_password()));
        }

        return new MemberUpdateResponseDto(
                member.getUserId(),
                member.getSpecificity_disease()
        );
    }

    @Override
    @Transactional
    public MemberDeleteResponseDto deleteMember(String userId, MemberDeleteRequestDto deleteRequestDto) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        if (!passwordEncoder.matches(deleteRequestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        memberRepository.delete(member);

        return new MemberDeleteResponseDto("회원 삭제 완료");
    }
}
