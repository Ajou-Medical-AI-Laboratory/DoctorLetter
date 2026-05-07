package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberUpdateRequestDto {
    private String userId;
    private String password;
    private String specificity_disease;
}
