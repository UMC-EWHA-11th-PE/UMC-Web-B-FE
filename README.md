# 🌐 Web-B

UMC EWHA 11th PE Web B 레포지토리입니다.

## 🙌 Our Crew

| 닉네임 | 이름 | GitHub |
|:---:|:---|:---|
| 전졔 | 전지혜 | [@jjihye-0108](https://github.com/jjihye-0108) |
| 은비 | 김은비 | [@Eunbi2741](https://github.com/Eunbi2741) |
| 미로 | 김형륜 | [@kimhyeongryun](https://github.com/kimhyeongryun) |
| 제이드 | 서영 | [@Jade0728](https://github.com/Jade0728) |
| 조던 | 김재희 | [@goodispotato](https://github.com/goodispotato) |

---

## 🌳 Branch 구조

작업 공간을 안전하게 분리하기 위해 아래와 같은 브랜치 구조를 사용합니다.

```text
main
 └── 닉네임/main (개인별 기본 브랜치)
      ├── 닉네임/week1 (1주차 작업 브랜치)
      ├── 닉네임/week2 (2주차 작업 브랜치)
      └── ...
```
### ⚠️ PR(Pull Request) 생성 시 주의사항
주차별 작업 브랜치(예: 닉네임/week1)에서 작업을 마치고 PR을 올릴 때, Base는 공통 main 브랜치가 아닌 본인의 닉네임/main 브랜치로 지정해 주세요!

---
## 💡 Commit Convention
일관성 있는 기록을 위해 아래의 커밋 메시지 규칙을 준수합니다.

| Type | Description |
| :--- | :--- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `docs` | 문서/주석 수정 |
| `chore` | 빌드 설정, 패키지 관리 등 |
