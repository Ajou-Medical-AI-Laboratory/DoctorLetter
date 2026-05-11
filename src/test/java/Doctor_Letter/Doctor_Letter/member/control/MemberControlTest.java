package Doctor_Letter.Doctor_Letter.member.control;

import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateRequestDto;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class MemberControlTest {

    private static final String VALID_PW = "P@ssw0rd";
    private static final String NEW_VALID_PW = "NewPw1!";

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    private void signUp(String userId, String password) throws Exception {
        MemberCreateRequestDto req = MemberCreateRequestDto.builder()
                .userId(userId).password(password).age(30).sex("M").name("이름").build();
        mockMvc.perform(post("/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void createMember_정상_가입() throws Exception {
        MemberCreateRequestDto req = MemberCreateRequestDto.builder()
                .userId("tester01").password(VALID_PW).age(30).sex("M").name("테스터").build();

        mockMvc.perform(post("/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("tester01"));
    }

    @Test
    void createMember_정책_위반_실패() throws Exception {
        MemberCreateRequestDto req = MemberCreateRequestDto.builder()
                .userId("weakpw").password("alllowercase").age(30).sex("M").name("약함").build();

        ServletException ex = assertThrows(ServletException.class, () ->
                mockMvc.perform(post("/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
        );
        assertThat(ex.getRootCause())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("비밀번호는");
    }

    @Test
    void getMember_가입후_조회_성공() throws Exception {
        signUp("tester02", VALID_PW);

        mockMvc.perform(get("/me").with(user("tester02")))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("tester02"))
                .andExpect(jsonPath("$.name").value("이름"));
    }

    @Test
    void deleteMember_올바른_비밀번호_삭제_성공() throws Exception {
        signUp("tester03", VALID_PW);

        String body = "{\"password\":\"" + VALID_PW + "\"}";
        mockMvc.perform(delete("/delete")
                        .with(user("tester03"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("회원 삭제 완료"));
    }

    @Test
    void deleteMember_틀린_비밀번호_실패() throws Exception {
        signUp("tester04", VALID_PW);

        String body = "{\"password\":\"WrongPw1!\"}";
        ServletException ex = assertThrows(ServletException.class, () ->
                mockMvc.perform(delete("/delete")
                        .with(user("tester04"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
        );
        assertThat(ex.getRootCause())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("비밀번호가 일치하지 않습니다.");
    }

    @Test
    void updateMember_특이질환_변경_성공() throws Exception {
        signUp("tester05", VALID_PW);

        String body = "{\"password\":\"" + VALID_PW + "\",\"specificity_disease\":\"고혈압\"}";
        mockMvc.perform(patch("/update")
                        .with(user("tester05"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("tester05"))
                .andExpect(jsonPath("$.specificity_disease").value("고혈압"));
    }

    @Test
    void updateMember_새비번_변경_성공() throws Exception {
        signUp("tester06", VALID_PW);

        String body = "{\"password\":\"" + VALID_PW + "\",\"new_password\":\"" + NEW_VALID_PW + "\"}";
        mockMvc.perform(patch("/update")
                        .with(user("tester06"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk());

        // 새 비번으로 다시 update 호출 → 200 (새 비번이 적용됨)
        String confirm = "{\"password\":\"" + NEW_VALID_PW + "\",\"specificity_disease\":\"당뇨\"}";
        mockMvc.perform(patch("/update")
                        .with(user("tester06"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(confirm))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.specificity_disease").value("당뇨"));
    }

    @Test
    void updateMember_새비번이_기존과_같으면_실패() throws Exception {
        signUp("tester08", VALID_PW);

        String body = "{\"password\":\"" + VALID_PW + "\",\"new_password\":\"" + VALID_PW + "\"}";
        ServletException ex = assertThrows(ServletException.class, () ->
                mockMvc.perform(patch("/update")
                        .with(user("tester08"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
        );
        assertThat(ex.getRootCause())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이전 비밀번호와 같을 수 없습니다.");
    }

    @Test
    void updateMember_새비번_정책위반_실패() throws Exception {
        signUp("tester07", VALID_PW);

        String body = "{\"password\":\"" + VALID_PW + "\",\"new_password\":\"weakpw\"}";
        ServletException ex = assertThrows(ServletException.class, () ->
                mockMvc.perform(patch("/update")
                        .with(user("tester07"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
        );
        assertThat(ex.getRootCause())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("비밀번호는");
    }
}
