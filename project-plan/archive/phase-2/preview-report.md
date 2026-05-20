# Apple-inspired DS Preview Report

## 실행 주체 선택

Codex가 실행했다. 이유:

- 이미 프로젝트와 Apple token 산출물 컨텍스트를 갖고 있었다.
- Figma MCP와 Playwright 브라우저 도구를 직접 호출할 수 있었다.
- Claude로 전체 작업을 넘기면 파일 재탐색/맥락 전달 비용이 커져 토큰과 시간이 더 든다.

Claude에는 구현 후 검토만 요청했다.

## HTML 산출물

- File: `design-systems/apple/preview.html`
- Local URL: `http://127.0.0.1:4177/design-systems/apple/preview.html`
- Browser check: PASS
- Console errors/warnings: 0
- Screenshot: Playwright output `apple-ds-preview.png`

## Figma 산출물

- File: `https://www.figma.com/design/9cevQvPHlQ5vZv5Pz3QaLL/Untitled?node-id=2-2`
- Page: `Apple-inspired DS Preview`
- Root frame: `2:2`
- Created nodes: 72
- Mutated nodes: page `0:1`
- Screenshot check: PASS via Figma `get_screenshot`

## 포함 내용

- Glass navigation
- Light hero section
- Color roles
- Typography roles
- Button/Card/Hero component candidates
- Dark mode preview
- “Apple-inspired / not official Apple DS” 명시

## Codex 검토

충분한 1차 확인용 preview다. HTML은 사용자가 브라우저에서 바로 확인 가능하고, Figma에는 같은 구조의 정적 캔버스가 생성되어 있다. 단, 이 단계는 “시각 미리보기”이며 Figma variables/component variants까지 만든 정식 design library는 아니다.

## 보완 권장

1. 다음 단계에서 Figma variables와 Button/Card component set을 실제로 만들면 design-system 시연력이 올라간다.
2. Preview 상단 또는 Figma 캔버스 하단에 “Not official Apple DS” 문구를 더 크게 넣으면 공식 오해 리스크가 더 줄어든다.

## Claude 검토 결과 반영

Claude 검토 결론:

- HTML/Figma preview는 사용자 확인용으로 충분하다.
- “Apple-inspired / not official” 문구와 metadata로 공식 오해 리스크는 대부분 줄었다.
- 잔여 리스크는 `apple-tokens.json`에서 `SF Pro`가 fontFamily 첫 순서로 들어간 점.
- 보완 권장: font fallback 안전화, 상단 disclaimer 강화.

반영한 보완:

1. `apple-tokens.json`의 기본 `display/text` fontFamily를 `Inter, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif`로 변경했다.
2. SF Pro는 `projectFallback` 후순위에만 남기고 “공식/번들 아님” 설명을 추가했다.
3. HTML glass nav 우측에 `Apple-inspired only · not official` 문구를 추가했다.
4. Figma root frame `2:2` 상단 nav에도 동일 disclaimer text node `3:2`를 추가했다.
5. HTML console 재검증: errors/warnings 0.
6. Figma screenshot 재검증: PASS.
