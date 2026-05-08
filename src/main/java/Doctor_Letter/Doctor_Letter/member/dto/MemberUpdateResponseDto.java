package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberUpdateResponseDto {
    private String userId;
    private String specificity_disease;

    public MemberUpdateResponseDto(String userId, String specificity_disease) {
        this.userId = userId;
        this.specificity_disease = specificity_disease;
    }
}
