# Phase 5-7 — dev 반영 (3중 게이트)

## 상태

✅ **완료**

## 목표

3중 승인 게이트를 통과한 change set만 `uno-home/dist-dev/`로 반영. 로컬 전용이므로 git 브랜치 사용 안 함.

## 담당 에이전트

`executor` + `qa-tester`

---

## dev 환경 정의

`uno-home/dist-dev/` 디렉토리 + `npm run preview`로 검증. 로컬 전용이므로 git 브랜치 사용하지 않음.

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `scripts/pipeline/promote-dev.ts` | 3중 게이트 검증 + `dist-dev/` 반영 + smoke test |
| `uno-home/dist-dev/` | dev 환경 산출물 |
| `package.json` `figma:promote` 스크립트 | 수동 실행 |
| `scripts/pipeline/run.sh` `[8/8]` promote-to-dev 활성화 | — |

---

## 3중 승인 게이트 (모두 통과해야 promote)

| # | 게이트 | 검증 방법 |
|---|---|---|
| 1 | `.approved` 파일 존재 | `.automation/reports/{id}.approved` 파일 stat |
| 2 | frontmatter `status == approved` | 리포트 .md 파싱 |
| 3 | `reportSha256` 재계산 일치 | 리포트 본문 해시 재계산하여 frontmatter 값과 비교 (위변조 감지) |

세 가지 중 하나라도 실패 시 promote abort + 사유 로그.

---

## 반려 시 거동

| 상황 | 동작 |
|---|---|
| `.rejected` 존재 | 다음 사이클 diff에서 동일 노드+동일 값 변경은 자동 report-only로 강등 (중복 푸시 방지) |
| 매핑 갱신 필요 | 별도 CLI `npm run figma:remap <id>`로 분리 |

---

## 검증 기준 (계약)

- ❌ 3중 게이트 중 하나라도 실패하면 promote abort + 사유 로그
- ✅ promote 후 smoke test (`npm run preview` 기동 + Playwright 1회 스크린샷)
- ✅ 결과를 리포트에 추가

---

## promote 흐름

```
1. change-set-id 입력 받기
2. 3중 게이트 검증
   - .approved 파일 존재? (빠른 fail)
   - frontmatter status == approved? (yaml 파싱)
   - reportSha256 일치? (재계산)
3. (게이트 통과)
   - npm run build
   - dist/ → dist-dev/ 복사
4. smoke test
   - npm run preview (background)
   - Playwright로 21개 매핑 항목 중 핵심 화면(home, family) 1회 스크린샷
   - preview 종료
5. 결과를 리포트에 append
   - promote 시각, smoke test 결과 기록
```

---

## 다음 단계로의 영향

| 다음 단계 | 5-7이 미칠 영향 |
|---|---|
| 5-8 launchd | 매일 21:00 실행 시 promote-dev까지 자동 진행 (디자이너 승인 대기 중인 change set은 자연히 skip) |

---

## 의존성

- ✅ 5-4 apply.ts M1 완료
- ✅ 5-6 리포트/승인 CLI 완료 (게이트 1·2·3 입력 데이터)
- ✅ 5-5 verify.ts 완료
