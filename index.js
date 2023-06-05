const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const cors = require("cors");

const app = express();
const PORT = process.env.port || 3030; // 포트

// body-parser를 사용하여 요청의 본문(body)을 파싱합니다.
app.use(bodyParser.urlencoded({ limit: 5000000, extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: 5000000 }));

// 넷스캠 DB 접속정보 추가
const db_config = {
  host: "boragu.csv9ypwfilfc.ap-northeast-2.rds.amazonaws.com",
  user: "edutem",
  password: "boragu2016",
  database: "tmp",
};
const connection = mysql.createConnection(db_config);

function handleDisconnect() {
  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 1000);
    }
  });
  connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      return handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.use(cors());

app.get("/", (req, res) => {
  const sql = "select * from wp_homepage_info";

  connection.query(sql, function (err, result, fields) {
    if (err) console.log(err);
    return res.send(result);
  });
});

app.post("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const data = req.body.data;

  const ref = [
    data.businessType,
    data.companyName,
    data.detail,
    data.email,
    data.file,
    data.homePageAddress,
    data.interestedField,
    data.introduction,
    data.name,
    data.phoneNumber,
    data.sample,
  ];
  const InsertQuery =
    "INSERT INTO wp_homepage_info (businessType, address, detail, email, file, homePageAddress, interestedField, introduction, name, phoneNumber, sample ) VALUES(?)";

  connection.query(InsertQuery, [ref], (err, result) => {
    if (err) return res.json(err);
    return res.json("데이터 입력이 성공되었습니다!");
  });
});

app.get("/media", (req, res) => {
  // const sorting = req.body.sort;
  // if (sorting === 0) {
  const sql = "select * from wp_main_title_content order by regDate desc";
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    console.log(result);
    return res.send(result);
  });
  // } else if (sorting === 1) {
  //   const sql = "select main_image, main_text, regDate from wp_main_title_content order by regDate desc";
  //   connection.query(sql, function (err, result) {
  //     if (err) console.log(err);
  //     return res.send(result);
  //   });
  // }
});

// app.post("/searchmedia", (req, res) => {
//   const word = req.body.searchInput;
//   const sql = `select main_image, main_text, regDate  from wp_main_title_content where  main_text like '%${word}%'`;
//   connection.query(sql, function (err, result) {
//     if (err) console.log(err);
//     return res.send(result);
//   });
// });

app.post("/media", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const html = req.body.data;
  console.log(html.title);
  const ref = [html.title, html.img, html.html];
  const InsertQuery = "INSERT INTO wp_main_title_content (title, main_image, main_text ) VALUES(?,?,?)";

  connection.query(InsertQuery, ref, (err, result) => {
    if (err) return res.json(err);
    return res.json("데이터 입력이 성공되었습니다!");
  });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
