# Figma Automation Guide

이 문서는 Figma 파일과 로컬 코드 자동화 파이프라인을 반복 운영하는 방법을 정리한 상위 가이드입니다. 현재 샘플 프로젝트는 UNO HOME이지만, 새 사용자는 본인 프로젝트명과 본인 Figma 파일로 바꿔 사용할 수 있습니다.

상세 운영 문서는 `uno-home/README.md`에 있고, 이 파일은 상위 폴더에서 바로 확인하기 위한 진입 문서입니다.

## 현재 등록 상태

| 항목 | 값 |
|---|---|
| Figma 파일 | `https://www.figma.com/design/SXPVingkmqkrcLzcXYFsZd/Untitled?m=dev` |
| 프로젝트 폴더 | `uno-home/` |
| 매핑 파일 | `uno-home/config/figma-mapping.yaml` |
| 전체 매핑 수 | `186` |
| 등록된 screen/frame 수 | `173` |
| 현재 승인 baseline | `uno-home/.automation/baseline/2026-05-06T06-00-44.json` |
| 반복 운영 상세 문서 | `uno-home/README.md` |

Figma 파일의 top-level frame은 모두 등록되어 있습니다. React 화면으로 아직 구현되지 않은 프레임은 `uno-home/src/screens/FigmaFrameTracking.ts`에 연결된 `report-only` 추적 대상으로 등록했습니다.

## 매일 반복 실행 방법

같은 Figma 파일을 계속 사용하는 경우에는 설정을 바꾸지 않고 아래만 실행합니다.

```bash
cd /Users/juhee/Work/Test/design-test/uno-home
npm run figma:run
```

실행 후 변경이 있으면 아래 리포트를 확인합니다.

```bash
uno-home/.automation/reports/cs-{id}.md
uno-home/.automation/reports/diff-report-only-{timestamp}.md
```

변경이 없으면 designer-review 리포트는 생성되지 않고, apply/verify 운영 로그만 남습니다.

## 승인 / 반려

```bash
cd /Users/juhee/Work/Test/design-test/uno-home
npm run figma:approve cs-{id}
npm run figma:promote cs-{id}
```

반려할 때는 사유를 남깁니다.

```bash
npm run figma:reject cs-{id} "reason"
```

## 새로 받은 사람이 처음 사용할 때

1. 전달받은 `design-test` 폴더를 원하는 위치에 둡니다.
2. `uno-home/.env` 파일을 새로 만들고 본인 Figma token을 넣습니다.
3. 의존성을 설치합니다.
4. preflight로 로컬 설정을 확인합니다.
5. 같은 Figma 파일을 쓸지, 본인 앱 Figma 파일/디자인 시스템 Figma 파일로 바꿀지 결정합니다.

```bash
cd /받은경로/design-test/uno-home
npm install
printf 'FIGMA_TOKEN=본인_FIGMA_TOKEN\n' > .env
npm run figma:preflight
```

같은 Figma 파일 `SXPVingkmqkrcLzcXYFsZd`를 쓰면 바로 `npm run figma:run`을 실행하면 됩니다. 전달받은 `.automation/baseline/`이 있으면 처음부터 기존 186개 매핑 기준으로 비교합니다.

## 본인 프로젝트명과 다른 Figma 파일을 사용할 때

다른 Figma 파일도 사용할 수 있습니다. 단, 기존 `figmaNodeId`는 원본 파일 전용이므로 새 파일로 바꿀 때는 mapping과 baseline을 새로 만들어야 합니다. 프로젝트명과 npm package 이름도 이 단계에서 바꿀 수 있습니다.

앱 화면 Figma 파일만 있는 경우:

```bash
cd /받은경로/design-test/uno-home
npm run figma:register-file -- "https://www.figma.com/design/앱_FILE_KEY/파일명?m=dev" --project-name "프로젝트명" --package-name "package-name"
npm run figma:preflight
npm run figma:run
```

앱 화면 Figma 파일과 별도 디자인 시스템 Figma 파일이 모두 있는 경우:

```bash
cd /받은경로/design-test/uno-home
npm run figma:register-file -- "https://www.figma.com/design/앱_FILE_KEY/파일명?m=dev" --project-name "프로젝트명" --package-name "package-name" --design-system-url "https://www.figma.com/design/디자인시스템_FILE_KEY/파일명?m=dev"
npm run figma:preflight
npm run figma:run
```

`figma:register-file`은 다음을 수행합니다.

- 기존 `config/figma.yaml`, `config/figma-mapping.yaml`, `package.json`을 `.automation/backups/`에 백업
- 새 Figma fileKey로 `config/figma.yaml` 갱신
- `--project-name` 값을 `config/figma-mapping.yaml`의 project name으로 저장
- `--package-name` 값을 `package.json`의 package name으로 저장
- 앱 Figma 파일의 top-level frame을 전부 `screens:`에 등록
- `--design-system-url`이 있으면 디자인 시스템 파일의 top-level `FRAME`, `COMPONENT`, `COMPONENT_SET`을 `components:`에 등록
- 새로 등록한 항목은 모두 `report-only` tracking 대상으로 설정
- 기존 components/compositions 자동 반영 매핑은 새 파일 기준으로 초기화

첫 실행에서는 “새로 등록된 프레임”이 대량 변경으로 잡힙니다. 이 change-set은 새 baseline을 만들기 위한 등록용 변경입니다.

```bash
npm run figma:approve cs-{id}
npm run figma:promote cs-{id}
npm run figma:run
```

마지막 `npm run figma:run`에서 `Changes: 0`이 나오면 새 Figma 파일 기준 baseline 설정이 끝난 것입니다.

주의할 점:

- 다른 Figma 파일에서는 기본적으로 report-only tracking만 됩니다.
- 원본 프로젝트처럼 token/text/prop 자동 반영까지 원하면 새 앱/디자인 시스템 파일의 컴포넌트 node ID를 `components:` / `compositions:`에 별도로 다시 매핑해야 합니다.
- route가 없는 frame은 실제 앱 visual diff가 아니라 markdown report로만 확인됩니다.
- 폴더명 `uno-home` 자체를 바꾸고 싶으면 폴더 rename은 가능하지만, launchd plist를 쓰는 경우 `config/com.uno-home.figma-pipeline.plist`의 경로/label도 새 경로에 맞게 수정해야 합니다.

## 새 Figma 프레임이 생겼을 때

새 top-level frame이 추가된 경우에만 매핑을 추가합니다.

1. Figma REST API로 `GET /v1/files/{fileKey}?depth=2`를 조회합니다.
2. top-level `FRAME` 노드를 찾습니다.
3. `uno-home/config/figma-mapping.yaml`에 이미 `figmaNodeId`가 있는지 확인합니다.
4. 없는 프레임만 `screens:` 아래에 추가합니다.
5. 아직 React route가 없으면 `code: ../src/screens/FigmaFrameTracking.ts`, `automation.apply: report-only`로 등록합니다.
6. `npm run figma:preflight`를 실행합니다.
7. `npm run figma:run`을 실행합니다.
8. 등록 change-set을 approve/promote해서 baseline을 갱신합니다.
9. 다시 `npm run figma:run`을 실행해 `Changes: 0`인지 확인합니다.

## 중요한 기준

프레임이 baseline에 등록된 이후의 변경만 정확히 감지할 수 있습니다. 예를 들어 `0:8063 / mo - No Home Hub`는 이제 등록되어 있으므로, 앞으로 문구나 구조가 바뀌면 diff/report에 잡힙니다.

다만 route가 없는 tracking-only 프레임은 실제 앱 화면 visual diff가 아니라 markdown report-only 리포트로만 확인합니다. 앱 UI가 실제로 바뀌었는지는 route가 연결된 화면에서만 visual diff로 검증됩니다.
