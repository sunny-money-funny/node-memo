const readline = require("readline");
const mysql = require("mysql2");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

require("dotenv").config(); // dotenv 설정을 불러옵니다

const dbConfig = {
  host: process.env.DB_HOST, // .env 파일에서 불러온 RDS 엔드포인트
  user: process.env.DB_USER, // .env 파일에서 불러온 RDS 사용자 이름
  password: process.env.DB_PASSWORD, // .env 파일에서 불러온 RDS 비밀번호
  database: process.env.DB_DATABASE, // .env 파일에서 불러온 데이터베이스 이름
};

// 연결 풀 생성
const pool = mysql.createPool(dbConfig).promise();

// 메모 목록 보기
async function viewMemos() {
  console.log("\n");
  try {
    const [rows] = await pool.query(
      "SELECT id, title, created_at FROM memos ORDER BY created_at DESC"
    );
    if (rows.length === 0) {
      console.log("저장된 메모가 없습니다.");
    } else {
      console.log("==== 메모 목록 ====");
      rows.forEach((row) => {
        console.log(`${row.id}. ${row.title} (${row.created_at})`);
      });
    }
  } catch (err) {
    console.error("메모 목록을 가져오는 중 오류가 발생했습니다:", err);
  }
  mainMenu(); // 메인 메뉴로 돌아가기
}

// 새 메모 작성
async function addMemo() {
  console.log("\n");
  rl.question("메모 제목을 입력하세요: ", (title) => {
    rl.question("메모 내용을 입력하세요: ", async (content) => {
      try {
        const sql = `INSERT INTO memos (title, content) VALUES (?, ?)`;
        await pool.query(sql, [title, content]);
        console.log("메모가 저장되었습니다.");
      } catch (err) {
        console.error("메모 저장 중 에러가 발생했습니다:", err);
      }
      mainMenu(); // 메인 메뉴로 돌아가기
    });
  });
}

// 메모 읽기
async function readMemo() {
  console.log("\n");
  try {
    const [rows] = await pool.query(
      "SELECT id, title, created_at FROM memos ORDER BY created_at DESC"
    );
    if (rows.length === 0) {
      console.log("저장된 메모가 없습니다.");
      mainMenu();
      return;
    }
    console.log("==== 메모 목록 ====");
    rows.forEach((row) => {
      console.log(`${row.id}. ${row.title} (${row.created_at})`);
    });
  } catch (err) {
    console.error("메모 목록을 가져오는 중 오류가 발생했습니다:", err);
  }
  rl.question("읽을 메모 번호(ID)를 입력하세요: ", async (id) => {
    const memoId = parseInt(id);
    if (isNaN(memoId)) {
      console.log("잘못된 번호입니다.");
      mainMenu();
      return;
    }

    try {
      const [rows] = await pool.query("SELECT * FROM memos WHERE id = ?", [
        memoId,
      ]);
      if (rows.length === 0) {
        console.log("해당 ID의 메모가 존재하지 않습니다.");
      } else {
        const memo = rows[0];
        console.log("\n==== 메모 ====");
        console.log(`제목: ${memo.title}`);
        console.log(`내용: ${memo.content}`);
        console.log(`작성 시각: ${memo.created_at}`);
      }
    } catch (err) {
      console.error("메모를 읽는 중 오류가 발생했습니다:", err);
    }
    mainMenu(); // 메인 메뉴로 돌아가기
  });
}

// 종료
function exitApp() {
  console.log("\n");
  console.log("메모장을 종료합니다.");
  pool.end().then(() => rl.close());
}

// 메인 메뉴
function mainMenu() {
  console.log("\n");
  console.log("==== 간단한 메모장 ====");
  console.log("1. 새 메모 작성");
  console.log("2. 메모 목록 보기");
  console.log("3. 메모 읽기");
  console.log("4. 종료");
  rl.question("원하는 작업을 선택하세요 (1-4): ", (choice) => {
    switch (choice) {
      case "1":
        addMemo();
        break;
      case "2":
        viewMemos();
        break;
      case "3":
        readMemo();
        break;
      case "4":
        exitApp();
        break;
      default:
        console.log("잘못된 입력입니다. 1~4 사이의 숫자를 선택하세요.");
        mainMenu(); // 잘못된 입력에 대해 다시 선택을 받음
    }
  });
}

mainMenu();
