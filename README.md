# 간단한 CLI 메모장 (AWS RDS 연동)

이 프로젝트는 AWS RDS(MySQL)를 활용한 CLI 기반의 간단한 메모장 애플리케이션입니다. Node.js로 작성되었으며, 사용자가 메모를 추가하고, 목록을 조회하며, 특정 메모를 읽을 수 있습니다.

## 기능

- 새 메모 작성
- 메모 목록 보기
- 특정 메모 읽기
- 종료

## 설치 및 실행 방법

### 1. 프로젝트 클론

```sh
git clone <레포지토리 URL>
cd <프로젝트 디렉터리>
```

### 2. 의존성 설치

```sh
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음과 같이 설정합니다:

```sh
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=your-rds-username
DB_PASSWORD=your-rds-password
DB_NAME=your-database-name
```

### 4. 실행

```sh
node app.js
```

## 데이터베이스 테이블 생성

아래의 SQL을 실행하여 `memos` 테이블을 생성해야 합니다:

```sql
CREATE TABLE memos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 사용 예시

1. 새 메모 작성 → 제목과 내용을 입력하면 저장됩니다.
2. 메모 목록 보기 → 저장된 메모의 제목이 나열됩니다.
3. 메모 읽기 → 특정 ID를 입력하면 해당 메모의 내용을 확인할 수 있습니다.
4. 종료 → 프로그램을 종료합니다.

## 기술 스택

- Node.js
- MySQL (AWS RDS)
- dotenv (환경 변수 관리)
- readline (CLI 입력 처리)

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
