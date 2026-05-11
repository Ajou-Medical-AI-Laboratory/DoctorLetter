package Doctor_Letter.Doctor_Letter.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Getter
@NoArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @Column(length = 1024)
    private String token;

    private Instant expiryDate;

    @Builder
    public RefreshToken(String userId, String token, Instant expiryDate) {
        this.userId = userId;
        this.token = token;
        this.expiryDate = expiryDate;
    }
}
