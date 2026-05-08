package Doctor_Letter.Doctor_Letter.member.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String password;
    private String sex;
    private String name;
    private int age;
    private String specificity_disease;

    @Builder
    public Member(String userId, String password, String sex, String name, int age, String specificity_disease) {
        this.userId = userId;
        this.password = password;
        this.sex = sex;
        this.name = name;
        this.age = age;
        this.specificity_disease = specificity_disease;
    }
}
