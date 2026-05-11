package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;

@Getter
@NoArgsConstructor
public class MemberUpdateRequestDto {
    private String password;
    private String specificity_disease;
    private String new_password;
}
