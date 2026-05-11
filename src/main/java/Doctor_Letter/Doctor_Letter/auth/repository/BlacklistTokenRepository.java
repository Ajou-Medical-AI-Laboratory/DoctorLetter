package Doctor_Letter.Doctor_Letter.auth.repository;

import Doctor_Letter.Doctor_Letter.auth.domain.BlacklistToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistTokenRepository extends JpaRepository<BlacklistToken, Long> {
    boolean existsByToken(String token);
}
