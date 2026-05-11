package Doctor_Letter.Doctor_Letter.auth.service;

import Doctor_Letter.Doctor_Letter.auth.domain.BlacklistToken;
import Doctor_Letter.Doctor_Letter.auth.domain.RefreshToken;
import Doctor_Letter.Doctor_Letter.auth.dto.LoginRequestDto;
import Doctor_Letter.Doctor_Letter.auth.dto.TokenResponseDto;
import Doctor_Letter.Doctor_Letter.auth.jwt.JwtTokenProvider;
import Doctor_Letter.Doctor_Letter.auth.repository.BlacklistTokenRepository;
import Doctor_Letter.Doctor_Letter.auth.repository.RefreshTokenRepository;
import Doctor_Letter.Doctor_Letter.member.domain.Member;
import Doctor_Letter.Doctor_Letter.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public TokenResponseDto login(LoginRequestDto request) {
        Member member = memberRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(member.getUserId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(member.getUserId());

        refreshTokenRepository.deleteByUserId(member.getUserId());
        refreshTokenRepository.flush();
        refreshTokenRepository.save(RefreshToken.builder()
                .userId(member.getUserId())
                .token(refreshToken)
                .expiryDate(jwtTokenProvider.getExpiration(refreshToken).toInstant())
                .build());

        return new TokenResponseDto(accessToken, refreshToken);
    }

    @Transactional
    public TokenResponseDto refresh(String refreshToken) {
        if (!jwtTokenProvider.validate(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 refresh token입니다.");
        }
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("저장된 refresh token이 없습니다."));

        String userId = jwtTokenProvider.getUserId(stored.getToken());
        String newAccessToken = jwtTokenProvider.generateAccessToken(userId);
        return new TokenResponseDto(newAccessToken, refreshToken);
    }

    @Transactional
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null && jwtTokenProvider.validate(accessToken)) {
            Date expiration = jwtTokenProvider.getExpiration(accessToken);
            if (!blacklistTokenRepository.existsByToken(accessToken)) {
                blacklistTokenRepository.save(
                        new BlacklistToken(accessToken, expiration.toInstant()));
            }
        }
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(refreshTokenRepository::delete);
        }
    }
}
