package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberCreateResponseDto {
    private String userId;

    public MemberCreateResponseDto(String userId) {
        this.userId = userId;
    }
}
