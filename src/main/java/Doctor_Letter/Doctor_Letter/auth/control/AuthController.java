package Doctor_Letter.Doctor_Letter.auth.control;

import Doctor_Letter.Doctor_Letter.auth.dto.LoginRequestDto;
import Doctor_Letter.Doctor_Letter.auth.dto.LogoutRequestDto;
import Doctor_Letter.Doctor_Letter.auth.dto.RefreshRequestDto;
import Doctor_Letter.Doctor_Letter.auth.dto.TokenResponseDto;
import Doctor_Letter.Doctor_Letter.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public TokenResponseDto login(@RequestBody LoginRequestDto request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public TokenResponseDto refresh(@RequestBody RefreshRequestDto request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader(value = "Authorization", required = false) String authHeader,
                       @RequestBody(required = false) LogoutRequestDto request) {
        String accessToken = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;
        String refreshToken = (request != null) ? request.getRefreshToken() : null;
        authService.logout(accessToken, refreshToken);
    }
}
