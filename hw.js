const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 메모 데이터를 저장할 파일 경로
const memoFilePath = "memos.json";

// 메모 데이터를 읽어오는 함수
function readMemos() {
  if (fs.existsSync(memoFilePath)) {
    const data = fs.readFileSync(memoFilePath, "utf8");
    return JSON.parse(data);
  } else {
    return [];
  }
}

// 메모 데이터를 파일에 저장하는 함수
function saveMemos(memos) {
  fs.writeFileSync(memoFilePath, JSON.stringify(memos, null, 2), "utf8");
}

// 새 메모 작성
function addMemo() {
  console.log("\n");
  rl.question("메모 제목을 입력하세요: ", (title) => {
    rl.question("메모 내용을 입력하세요: ", (content) => {
      const memos = readMemos();
      const newMemo = { title, content, date: new Date().toISOString() };
      memos.push(newMemo);
      saveMemos(memos);
      console.log("메모가 저장되었습니다 :", newMemo.date, newMemo.title);
      mainMenu(); // 메인 메뉴로 돌아가기
    });
  });
}

// 메모 목록 보기
function viewMemos() {
  console.log("\n");
  const memos = readMemos();
  if (memos.length === 0) {
    console.log("저장된 메모가 없습니다.");
  } else {
    console.log("==== 메모 목록 ====");
    memos.forEach((memo, index) => {
      console.log(`${index + 1}. ${memo.title} (${memo.date})`);
    });
  }
  mainMenu(); // 메인 메뉴로 돌아가기
}

// 메모 읽기
function readMemo() {
  console.log("\n");
  const memos = readMemos();
  if (memos.length === 0) {
    console.log("저장된 메모가 없습니다.");
    mainMenu(); // 메인 메뉴로 돌아가기
    return;
  }
  console.log("==== 메모 선택 ====");
  memos.forEach((memo, index) => {
    console.log(`${index + 1}. ${memo.title} (${memo.date})`);
  });
  rl.question("읽을 메모 번호를 선택하세요: ", (index) => {
    const memoIndex = parseInt(index) - 1;
    if (memoIndex >= 0 && memoIndex < memos.length) {
      const selectedMemo = memos[memoIndex];
      console.log("\n");
      console.log("==== ", selectedMemo.title, " ====");
      console.log(selectedMemo.content);
    } else {
      console.log("잘못된 번호입니다.");
    }
    mainMenu(); // 메인 메뉴로 돌아가기
  });
}

// 종료
function exitApp() {
  console.log("\n");
  console.log("메모장을 종료합니다.");
  rl.close();
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
