package Doctor_Letter.Doctor_Letter.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FindMemberResponseDto {
    private String userId;
    private String name;
    private int age;
    private String sex;
    private String specificity_disease;

    public FindMemberResponseDto(String userId, String name, int age, String sex, String specificity_disease) {
        this.userId = userId;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.specificity_disease = specificity_disease;
    }
}
