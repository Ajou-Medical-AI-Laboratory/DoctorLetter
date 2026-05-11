package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;

@Getter
public class MemberDeleteResponseDto {
    private final String message;

    public MemberDeleteResponseDto(String message) {
        this.message = message;
    }
}
