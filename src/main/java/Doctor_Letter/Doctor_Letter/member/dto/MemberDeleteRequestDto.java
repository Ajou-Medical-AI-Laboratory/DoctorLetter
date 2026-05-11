package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberDeleteRequestDto {
    private String password;

    public MemberDeleteRequestDto(String password) {
        this.password = password;
    }
}
