# Phase 5-8 — 스케줄러 등록 (launchd)

## 상태

✅ **완료**

## 목표

매일 정해진 시간(21:00)에 `scripts/pipeline/run.sh`를 자동 실행. 실패 시 로그를 남기고 다음 사이클까지 대기.

## 담당 에이전트

`executor` (Sonnet)

---

## 작업 정의 / 산출물

| 산출물 | 역할 |
|---|---|
| `config/com.uno-home.figma-pipeline.plist` | 프로젝트 내 plist 템플릿 |
| `~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist` | 설치된 launchd 설정 |
| `.automation/logs/scheduler-*.log` | 스케줄 실행 로그 (run.sh 자체 로그와는 별개) |
| `uno-home/docs/phase5-8.md` | 등록/해제 절차 문서화 |

---

## 검증 기준 (계약)

- ✅ 스케줄러는 preflight부터 실행
- ✅ 실패 로그는 `.automation/logs/`에 남김
- ✅ `launchctl print "gui/$UID/com.uno-home.figma-pipeline"`으로 등록 확인 가능
- ✅ `launchctl kickstart -k "gui/$UID/com.uno-home.figma-pipeline"` 수동 실행 통과

---

## plist 구조 (제안)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.uno-home.figma-pipeline</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/juhee/Work/Test/design-test/uno-home/scripts/pipeline/run.sh</string>
  </array>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>21</integer>
    <key>Minute</key><integer>0</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>/Users/juhee/Work/Test/design-test/uno-home/.automation/logs/scheduler-stdout.log</string>

  <key>StandardErrorPath</key>
  <string>/Users/juhee/Work/Test/design-test/uno-home/.automation/logs/scheduler-stderr.log</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
  </dict>
</dict>
</plist>
```

---

## 등록/해제 절차

### 등록

```bash
cp config/com.uno-home.figma-pipeline.plist ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
launchctl bootstrap "gui/$UID" ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
launchctl print "gui/$UID/com.uno-home.figma-pipeline"
```

### 해제

```bash
launchctl bootout "gui/$UID" ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
rm ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
```

### 수동 1회 실행 (테스트)

```bash
launchctl kickstart -k "gui/$UID/com.uno-home.figma-pipeline"
```

---

## 주의사항

| 항목 | 내용 |
|---|---|
| `FIGMA_TOKEN` | run.sh 내 `tsx --env-file=.env`로 로드되므로 plist에 별도 설정 불필요 |
| Node 경로 | 현재 머신은 `/usr/local/bin/node`, `/usr/local/bin/npm`, `/usr/local/bin/npx` 사용 |
| sleep 중 동작 | `StartCalendarInterval`은 sleep 중이면 다음 wake 직후 실행 |
| 실패 시 거동 | run.sh의 `set -e`로 첫 실패 단계에서 중단. 로그는 `.automation/logs/`에 stage별로 남음 |

---

## 다음 단계로의 영향

Phase 5의 마지막 단계. 이후 작업은 plan.md 외부:

- GitHub PR 자동 생성 (보류)
- 상용 배포 (보류)
- 매핑 외 변경 자동 분류 (5-3 unknown 처리 고도화)

---

## 의존성

- ✅ 5-1 ~ 5-7 모두 완료 (run.sh 8단계 모두 활성)
- ✅ run.sh를 비대화형(`set -e`, prompt 없음)으로 실행 가능한지 검증
- ✅ launchd 수동 실행에서 8단계 완료 및 exit code 0 확인
