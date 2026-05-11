package Doctor_Letter.Doctor_Letter.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LogoutRequestDto {
    private String refreshToken;
}
