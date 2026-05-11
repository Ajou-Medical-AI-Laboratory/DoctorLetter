package Doctor_Letter.Doctor_Letter.auth.password;

import java.util.regex.Pattern;

public final class PasswordPolicyValidator {

    private static final Pattern POLICY = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$"
    );

    private PasswordPolicyValidator() {
    }

    public static void validate(String password) {
        if (password == null || !POLICY.matcher(password).matches()) {
            throw new IllegalArgumentException(
                    "비밀번호는 대문자, 소문자, 특수문자를 모두 포함해야 합니다.");
        }
    }
}
