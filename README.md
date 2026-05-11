# 닥터레터 (Doctor Letter)

쉽게 이해하는 나의 건강 정보. React(Vite) 프론트엔드 + Spring Boot 백엔드.

## 사전 준비

- **JDK 17+** (백엔드)
- **Node.js 18+ / npm** (프론트엔드)
- **MySQL** 없이도 동작 (테스트는 H2 in-memory, 개발용 main DB도 H2로 띄울 수 있음 — 아래 참조)

---

## 폴더 구조

```
src/
├── main/java/Doctor_Letter/Doctor_Letter/   # Spring Boot 백엔드
│   ├── auth/                                # JWT, refresh/blacklist 토큰, 비번 정책
│   ├── member/                              # 회원 도메인 (도메인/DTO/서비스/컨트롤러)
│   └── config/SecurityConfig.java           # SecurityFilterChain, CORS, PasswordEncoder
├── main/resources/application.properties    # 서버/JWT 설정
├── test/                                    # JUnit 통합 테스트 (H2)
├── app/                                     # React 프론트엔드
│   ├── api/                                 # fetch 클라이언트 + auth/member API
│   ├── auth/AuthContext.tsx                 # 토큰 보관 (localStorage)
│   └── components/                          # UI 화면 (Login, Signup, Profile, ...)
├── main.tsx                                 # AuthProvider로 App 감쌈
└── styles/, imports/, ...
```

---

## 빠른 시작 — 같은 와이파이에서 팀원과 같이 보기

### 1. 자신의 LAN IP 확인

macOS / Linux:
```bash
ipconfig getifaddr en0    # macOS Wi-Fi
# 또는
hostname -I               # Linux
```
Windows: `ipconfig` 후 IPv4 주소 확인.

예: `192.168.0.42`

### 2. 백엔드 실행 (포트 8080)

```bash
./gradlew bootRun
```

`application.properties`에 `server.address=0.0.0.0`이 들어있어서 LAN의 다른 기기에서도 `http://<LAN-IP>:8080`으로 접근 가능합니다.

### 3. 프론트엔드 실행 (포트 5173)

```bash
npm i             # 처음 한 번만
npm run dev
```

`vite.config.ts`의 `server.host = '0.0.0.0'`로 LAN 노출. dev 환경에서는 `/auth`, `/me`, `/create`, `/update`, `/delete`가 자동으로 `http://localhost:8080` 백엔드로 proxy됩니다.

### 4. 팀원 접속

같은 와이파이의 모바일/PC에서:
```
http://<백엔드-실행한-PC의-LAN-IP>:5173/DoctorLetter/
```
(base path가 `/DoctorLetter/`로 설정되어 있음)

> **주의**: 프론트가 vite proxy로 백엔드를 부르기 때문에, 팀원의 브라우저는 `localhost:8080`이 아니라 그가 접속한 vite 서버를 통해 백엔드로 들어옵니다. 별도 작업 없이 작동합니다.

---

## 환경변수 — API base URL

기본값은 빈 문자열 (vite proxy 사용). LAN 외부에서 직접 백엔드를 호출해야 할 때(예: Capacitor 빌드, ngrok)는 `.env.local` 또는 `.env.production`에 지정:

```env
VITE_API_BASE_URL=http://192.168.0.42:8080
```

`src/app/api/client.ts`가 이 값을 읽어 절대 URL로 요청합니다.

---

## 백엔드 테스트

```bash
./gradlew test
```

JUnit 통합 테스트 (H2 in-memory):
- `MemberControlTest` — 가입/조회/수정/탈퇴, 비번 정책, 비번 변경
- `AuthControllerTest` — 로그인/토큰/리프레시/로그아웃 blacklist

---

## API 엔드포인트 요약

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | `/create` | ❌ | 회원가입 |
| POST | `/auth/login` | ❌ | 로그인 → access + refresh 토큰 |
| POST | `/auth/refresh` | ❌ | refresh로 새 access 발급 |
| POST | `/auth/logout` | ❌ | access를 blacklist에 등록, refresh 삭제 |
| GET | `/me` | ✅ | 내 정보 조회 |
| PATCH | `/update` | ✅ | 특이질환/비번 변경 (현재 비번 확인 필요) |
| DELETE | `/delete` | ✅ | 회원 탈퇴 (현재 비번 확인 필요) |

비밀번호 정책: **대문자 + 소문자 + 특수문자** 모두 포함.

---

## PWA (브라우저에서 홈 화면에 추가)

`public/manifest.webmanifest`와 `public/sw.js`가 포함되어 있습니다. 빌드 후 HTTPS(또는 localhost)에서 호스팅하면 모바일 브라우저의 "홈 화면에 추가"로 앱처럼 동작합니다.

```bash
npm run build       # dist/ 생성
```

> **아이콘**: `public/icon-192.png`, `public/icon-512.png`를 직접 채워야 정상 동작합니다 (현재 미포함).

Service Worker는 `localhost` / LAN IP에서는 자동 등록을 건너뜁니다 (dev 캐시 충돌 방지). 도메인이 있는 HTTPS 환경에서만 활성화됩니다.

---

## Capacitor (네이티브 앱 빌드, 선택)

웹 빌드 산출물을 그대로 iOS/Android 앱 셸에 wrap.

### 의존성 설치
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

### 초기화 & 플랫폼 추가
이미 `capacitor.config.json`이 들어있습니다. 빌드 후:
```bash
npm run build
npx cap add android       # Android Studio 필요
npx cap add ios           # macOS + Xcode 필요
npx cap sync
npx cap open android      # 또는 cap open ios
```

### 앱 빌드 시 API URL
번들된 앱은 localhost나 vite proxy를 알지 못합니다. 빌드 전에:
```env
VITE_API_BASE_URL=http://192.168.0.42:8080
```
같이 LAN의 백엔드 호스트를 지정해야 합니다.

iOS는 HTTP 호출 시 `Info.plist`에 `NSAppTransportSecurity` 예외, Android는 `cleartextTraffic` 허용이 필요합니다 (`capacitor.config.json`에 `cleartext: true`로 일부 처리됨).

---

## 트러블슈팅

- **로그인 시 401/403만 반환**: 백엔드 SecurityConfig에서 `/auth/**`, `/create`는 permitAll, 그 외는 인증 필요. 토큰이 만료되면 `apiFetch`가 자동으로 `/auth/refresh` 시도 후 실패하면 토큰 비웁니다.
- **CORS 에러**: 백엔드 `SecurityConfig.corsConfigurationSource()`가 모든 origin pattern 허용 중 (개발용). 운영 시 도메인 제한 필요.
- **포트 충돌**: 백엔드 8080 / 프론트 5173. `application.properties`나 `vite.config.ts`에서 변경 가능.
- **MySQL이 없는데 부트런이 실패**: `application.properties`에서 datasource 항목 제거하고 H2 의존성을 main에도 추가하거나, 테스트만 돌리세요.

---

## 비밀번호 정책 (가입 / 비번 변경)

정규식: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$`

- 대문자 1자 이상
- 소문자 1자 이상
- 특수문자 1자 이상

위반 시 백엔드가 `IllegalArgumentException("비밀번호는 대문자, 소문자, 특수문자를 모두 포함해야 합니다.")`를 던집니다. 프론트의 `Signup.tsx`에서도 동일 정책으로 실시간 체크합니다.

비밀번호 변경 시 새 비번이 이전 비번과 같으면 `"이전 비밀번호와 같을 수 없습니다."`로 거부됩니다.
