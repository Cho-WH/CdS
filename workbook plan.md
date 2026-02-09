# 인쇄용 워크북(Workbook) 제작 계획서

## 1. 개요
현재의 **동적 웹페이지(index.html)**를 **A4 출력용 정적 워크북(workbook.html)**으로 변환합니다. 교육 현장에서 학생들이 인쇄물로 받아보거나, 오프라인 환경에서 학습할 수 있도록 하는 것이 목표입니다.

## 2. 주요 변환 방향
1.  **배경 및 색상 테마 변경 (Dark Mode → Light/Print Mode)**
    *   잉크 절약 및 가독성을 위해 **흰색 배경(White Background)**에 **검은색 글자(Black Text)**로 변환합니다.
    *   어두운 카드 배경(`--card-bg`)을 제거하고, 대신 **테두리(Border)**나 **연한 회색 배경**을 사용하여 구획을 나눕니다.
    *   강조색(보라색, 민트색)은 유지하되, 흰 종이 위에서도 잘 보이도록 채도를 조절하거나 진한 색상으로 변경합니다.
2.  **동적 요소 제거 및 대체**
    *   **제거**: 실시간 반응형 시뮬레이터(`.viz-wrapper`, 스크립트 포함)는 인쇄물에서 동작하지 않으므로 삭제합니다.
    *   **대체**: 시뮬레이터가 있던 자리에 **"전압 분배 원리 요약 다이어그램"** 등 정적 이미지를 배치하거나, 해당 공간을 텍스트 설명으로 보완합니다. (별도 이미지 생성이 어렵다면 해당 섹션은 텍스트 위주로 재구성)
3.  **다운로드 링크 → QR 코드 변환**
    *   종이에서는 클릭이 불가능하므로, 펌웨어(.hex) 다운로드 버튼을 **QR 코드 이미지**로 대체합니다.
    *   QR 코드 옆에 단축 URL을 텍스트로 함께 병기하여 접근성을 높입니다.
4.  **A4 레이아웃 최적화**
    *   **페이지 분할**: `page-break-inside: avoid;` 등의 CSS 속성을 활용하여 섹션 제목과 내용이 페이지 넘김으로 인해 짤리지 않도록 합니다.
    *   **여백(Margin)**: 인쇄 바인딩을 고려한 적절한 여백을 설정합니다. (좌우 여백 확보)

## 3. 구현 상세 계획

### A. 파일 생성 및 기본 구조 (workbook.html)
*   `index.html`을 복사하여 `workbook.html` 생성.
*   `<script>` 태그(시뮬레이션 로직) 전면 삭제.
*   반응형 뷰포트 메타태그는 유지하되, 인쇄용 CSS(`@media print` 또는 별도 `<style>`)를 최우선으로 적용.
*   **모바일/태블릿용 미디어 쿼리** (`@media (max-width: ...)`) 제거 또는 비활성화 (인쇄물에서는 불필요).

### B. CSS 스타일링 (Print-Friendly)
*   **:root 변수 재정의**:
    ```css
    :root {
        --bg-color: #ffffff;
        --card-bg: #f9f9f9; /* 연한 회색으로 섹션 구분 */
        --text-main: #000000;
        --text-sub: #333333;
        --border-color: #cccccc;
        --accent-primary: #6B46C1; /* 진한 보라 */
        --accent-secondary: #047857; /* 진한 민트/녹색 */
        --accent-warn: #B91C1C; /* 진한 빨강 */
    }
    ```
*   **페이지 설정**:
    ```css
    @page {
        size: A4;
        margin: 20mm 15mm; /* 상하 20mm, 좌우 15mm */
    }
    body {
        margin: 0;
        padding: 0;
    }
    ```
*   **레이아웃 (Container)**:
    *   `max-width` 조정 또는 제거하여 A4 전체 폭 활용.
    *   `box-shadow` 전면 제거 → 필요시 `border: 1px solid #ccc`로 대체.
*   **페이지 넘김 처리**:
    *   각 주요 섹션(`section`) 앞에 `page-break-before: auto;` 적용 (또는 필요시 `always`).
    *   `section`, `div.visual-placeholder`, `img` 태그에 `break-inside: avoid;` 적용.
    *   `h2` 제목에 `break-after: avoid;` 적용하여 제목과 본문이 분리되지 않도록 함.
*   **폰트 처리**:
    *   웹폰트(Pretendard, Noto Sans KR 등)는 CDN에서 불러오므로 인쇄 시에도 작동하나, 만약을 대비해 **fallback 폰트** (시스템 폰트)를 명확히 지정.
    *   예: `font-family: 'Pretendard', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;`

### C. 콘텐츠 수정

#### 0. 문서 시작 부분 추가
*   **인쇄 안내 문구** (헤더 바로 위 또는 첫 페이지 상단):
    ```html
    <div class="print-guide">
        📄 이 워크북은 A4 용지에 양면 인쇄(컬러 권장)하여 사용하시면 됩니다.
    </div>
    ```
*   **목차(Table of Contents)** 추가 (헤더 직후):
    ```
    ## 목차
    1. 아날로그 신호의 이해: 0과 1 사이의 무한한 세계 ......... 2
    2. 전압 분배 법칙: 보이지 않는 저항을 낚아채는 기술 ....... 3
    3. 실전 회로 구성: 브레드보드 위에 구현되는 몸체 ........... 5
    4. 소프트웨어 로직: 마이크로비트 안에 구현되는 정신 ....... 7
    5. 선생님, 이거 안돼요! 실패는 성공의 어머니? ............. 9
    ```
*   **페이지 번호**: CSS로 각 페이지 하단 중앙에 자동 페이지 번호 삽입.
    ```css
    @page {
        @bottom-center {
            content: counter(page);
        }
    }
    ```

#### 1. Header & Intro
*   그라데이션 텍스트(`.main-title`) 제거 → 단색(진한 보라 `#6B46C1` 또는 검정) 처리.
*   키워드 칩 디자인: 배경색을 연하게(`#E0E7FF`), 테두리를 진하게(`#6B46C1`) 하여 흑백 인쇄 시에도 구분되도록 함.

#### 2. Section 1 (아날로그 신호) - 외부 이미지 처리
*   **외부 이미지 2개 존재**:
    1.  `https://www.processsensing.com/blogimg/analog%20vs%20digital%20sensors.png`
    2.  `https://create.routenote.com/blog/wp-content/uploads/2023/09/Picture4-960x540.png`
*   **처리 방안**:
    *   이미지가 인쇄 시 로드되도록 URL 유지 (대부분의 브라우저는 인쇄 시 외부 이미지도 불러옴).
    *   또는 이미지를 로컬로 다운로드하여 저장 후 경로 변경 (저작권 확인 필요).
    *   대안: 이미지 대신 텍스트 설명으로 대체하거나, `generate_image`로 유사한 다이어그램 생성.

#### 3. Section 2 (전압 분배) - 시뮬레이터 제거
*   `<div class="viz-wrapper">...</div>` 전체 삭제.
*   **대체 콘텐츠**:
    *   **옵션 A**: 시뮬레이터의 정적 스크린샷(브라우저에서 캡처)을 이미지로 삽입 + 설명 추가.
    *   **옵션 B**: 전압 분배 원리를 설명하는 간단한 다이어그램을 `generate_image` 도구로 생성.
    *   **옵션 C**: 텍스트 박스 형태로 핵심 공식과 설명을 정리:
        ```
        📐 전압 분배 공식
        V_out = V_in × (R_fixed / (R_CdS + R_fixed))
        - 빛이 밝으면: R_CdS ↓ → V_out ↑
        - 빛이 어두우면: R_CdS ↑ → V_out ↓
        ```
*   **학생 활동 공간 추가**: 시뮬레이터 대신 학생들이 손으로 계산해볼 수 있는 빈 칸 제공.
    ```
    [ 실습 활동 ]
    빛의 세기에 따른 저항값과 전압을 직접 계산해보세요!
    
    CdS 저항값: _______Ω → P0 전압: _______V → LED 개수: ___개
    ```

#### 4. Section 3 (실전 회로) - 로컬 이미지 처리
*   로컬 이미지 `cds2d.png`가 존재하므로 경로 유지.
*   인쇄 시 이미지 크기가 적절한지 확인 (너무 크면 페이지를 넘어갈 수 있음).
*   **준비물 체크리스트**를 실제 체크박스 형태로 변경:
    ```html
    <ul class="checklist">
        <li>☐ 마이크로비트 & 확장 보드</li>
        <li>☐ 브레드보드(빵판)</li>
        <li>☐ CdS 저항 1개</li>
        ...
    </ul>
    ```

#### 5. Section 4 (소프트웨어 & 다운로드)
*   로컬 이미지 `block.jpg`가 존재하므로 경로 유지.
*   다운로드 버튼(`<a href="CdS_sensor_1.1.hex">`) 삭제.
*   **QR 코드 영역 추가**:
    *   QR 코드 타겟 URL: 이전 대화에서 확인된 배포 주소 사용
        - 예: `https://cho-wh.github.io/CdS/CdS_sensor_1.1.hex` (GitHub Pages 주소 추정)
    *   QR 코드 생성:
        - Online API 사용: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://cho-wh.github.io/CdS/CdS_sensor_1.1.hex`
        - 또는 `generate_image` 툴로 QR 코드 이미지 생성
    *   캡션: "📱 스마트폰 카메라로 QR코드를 스캔하여 펌웨어(.hex) 다운로드"
    *   URL 텍스트 병기: `https://cho-wh.github.io/CdS/`

#### 6. Section 5 & 마무리
*   내용 유지, 스타일만 인쇄용으로 조정.

#### 7. Footer
*   저작권 정보 명시:
    ```
    © 찾아가는 반도체 교실 | 이 자료는 교육 목적으로만 사용 가능합니다.
    ```

### D. 추가 기능

#### 1. 학습 메모 공간
*   각 섹션 하단에 학생들이 필기할 수 있는 빈 공간 추가:
    ```html
    <div class="memo-space">
        <h4>💭 학습 메모</h4>
        <div class="memo-lines"></div>
    </div>
    ```
    ```css
    .memo-lines {
        height: 80px;
        border: 1px dashed #ccc;
        background: linear-gradient(transparent 39px, #e0e0e0 39px, #e0e0e0 40px, transparent 40px);
        background-size: 100% 40px;
    }
    ```

#### 2. 하이라이트 영역
*   중요한 개념은 **인쇄용 하이라이트 박스**로 강조:
    ```html
    <div class="highlight-box">
        ⚡ 핵심 개념: 전압 분배 회로는 두 개의 저항이 직렬로 연결되어...
    </div>
    ```

### E. 실행 순서
1.  `index.html`을 복사하여 `workbook.html` 생성.
2.  불필요한 JS(`<script>` 태그) 및 시뮬레이터 HTML 코드 삭제.
3.  색상 변수(CSS Variables) 수정 (Light Theme).
4.  인쇄 전용 CSS 속성(`@page`, `page-break`, `break-inside`) 추가.
5.  외부 이미지 처리 확인 (URL 유지 또는 로컬 저장).
6.  목차, 페이지 번호, 인쇄 안내 추가.
7.  준비물 체크리스트를 체크박스 형태로 변경.
8.  QR 코드 생성 및 배치 (타겟 URL 확정 후).
9.  학습 메모 공간 추가.
10. 브라우저 미리보기 및 PDF 인쇄 테스트.

## 4. 코더 전달 사항
*   **가독성 최우선**: 심미성보다 잉크 절약과 텍스트 가독성을 우선시해주세요.
*   **QR 코드**: 실제 `CdS_sensor_1.1.hex` 파일의 다운로드 링크(현재 로컬 경로라면 배포 후 URL 또는 임시 URL)를 QR로 변환해 넣어주세요. (없는 경우 더미 이미지 배정)
*   **페이지 나누기**: 각 챕터(1, 2, 3, 4, 5)가 가급적 페이지 상단에서 시작하거나, 적어도 제목과 본문이 떨어지지 않도록 신경 써주세요.
