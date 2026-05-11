package Doctor_Letter.Doctor_Letter.auth.repository;

import Doctor_Letter.Doctor_Letter.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUserId(String userId);
}
