package Doctor_Letter.Doctor_Letter.auth.control;

import Doctor_Letter.Doctor_Letter.auth.dto.TokenResponseDto;
import Doctor_Letter.Doctor_Letter.member.dto.MemberCreateRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    private static final String VALID_PW = "P@ssw0rd";

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

    private TokenResponseDto loginAndExtract(String userId, String password) throws Exception {
        String body = "{\"userId\":\"" + userId + "\",\"password\":\"" + password + "\"}";

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andReturn();

        return objectMapper.readValue(result.getResponse().getContentAsString(), TokenResponseDto.class);
    }

    @Test
    void login_정상_토큰발급() throws Exception {
        signUp("authuser1", VALID_PW);
        TokenResponseDto tokens = loginAndExtract("authuser1", VALID_PW);
        assertThat(tokens.getAccessToken()).isNotBlank();
        assertThat(tokens.getRefreshToken()).isNotBlank();
    }

    @Test
    void protected_엔드포인트_토큰없으면_차단() throws Exception {
        mockMvc.perform(get("/me"))
                .andDo(print())
                .andExpect(status().is4xxClientError());
    }

    @Test
    void protected_엔드포인트_유효한_access로_접근_성공() throws Exception {
        signUp("authuser2", VALID_PW);
        TokenResponseDto tokens = loginAndExtract("authuser2", VALID_PW);

        mockMvc.perform(get("/me")
                        .header("Authorization", "Bearer " + tokens.getAccessToken()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("authuser2"));
    }

    @Test
    void refresh_정상_새_access_발급() throws Exception {
        signUp("authuser3", VALID_PW);
        TokenResponseDto tokens = loginAndExtract("authuser3", VALID_PW);

        String body = "{\"refreshToken\":\"" + tokens.getRefreshToken() + "\"}";
        MvcResult result = mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andReturn();

        TokenResponseDto refreshed = objectMapper.readValue(
                result.getResponse().getContentAsString(), TokenResponseDto.class);
        assertThat(refreshed.getAccessToken()).isNotBlank();
        assertThat(refreshed.getRefreshToken()).isEqualTo(tokens.getRefreshToken());
    }

    @Test
    void logout_후_같은_access는_blacklist로_차단() throws Exception {
        signUp("authuser4", VALID_PW);
        TokenResponseDto tokens = loginAndExtract("authuser4", VALID_PW);

        mockMvc.perform(get("/me")
                        .header("Authorization", "Bearer " + tokens.getAccessToken()))
                .andExpect(status().isOk());

        String logoutBody = "{\"refreshToken\":\"" + tokens.getRefreshToken() + "\"}";
        mockMvc.perform(post("/auth/logout")
                        .header("Authorization", "Bearer " + tokens.getAccessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(logoutBody))
                .andExpect(status().isOk());

        mockMvc.perform(get("/me")
                        .header("Authorization", "Bearer " + tokens.getAccessToken()))
                .andDo(print())
                .andExpect(status().is4xxClientError());
    }
}
