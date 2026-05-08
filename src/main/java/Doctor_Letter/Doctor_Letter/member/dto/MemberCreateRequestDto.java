package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberCreateRequestDto {
    private Long id;
    private String userId;
    private int age;
    private String sex;
    private String name;
    private String password;

    @Builder
    public MemberCreateRequestDto(String userId, int age, String sex, String name, String password) {
        this.userId = userId;
        this.age = age;
        this.sex = sex;
        this.name = name;
        this.password = password;
    }
}
