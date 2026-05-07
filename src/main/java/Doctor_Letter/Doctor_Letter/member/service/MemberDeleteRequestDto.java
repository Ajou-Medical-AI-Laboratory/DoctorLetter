package Doctor_Letter.Doctor_Letter.member.service;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberDeleteRequestDto {
    private String userId;
    private String password;

     public MemberDeleteRequestDto(String userId, String password) {
        this.userId = userId;
        this.password = password;
    }
}
