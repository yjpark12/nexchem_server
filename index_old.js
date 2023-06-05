const express = require("express");
const mysql = require("mysql");

const cors = require("cors");

const app = express();
const PORT = process.env.port || 3030;  // 포트


// 넷스캠 DB 접속정보 추가
/*
var db_config = {

  host:'db.weltouch.net',
  user:'seiyoung7848',
  password:'seiyoung9193!@',
  database:'dbseiyoung7848'
  
};
*/

var db_config = {
  host:'boragu.csv9ypwfilfc.ap-northeast-2.rds.amazonaws.com',
  user:'edutem',
  password:'boragu2016',
  database:'tmp'  
};



var connection;

function handleDisconnect() {

  connection = mysql.createConnection(db_config); 

  connection.connect(function(err) {            
    if(err) {                            
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                   
  });                                 


  connection.on('error', function(err) {
    console.log('db error', err);

    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      console.log('MySQL DB 연결이 끊어졌습니다 !')
      return handleDisconnect();                      
    } else {                                    
      throw err;                              
    }
  });
}


handleDisconnect();

// Middlewares
app.use(cors());

// GET 호출시 :: 테이블 조회 쿼리 실행 
app.get('/', (req, res) => {
  
      var sql = 'select * from wp_homepage_info';      

      // connection.end();    // 연결 해제
      connection.query(sql, function (err, result, fields) {
        if (err) console.log(err);

        res.send(result);

      });

});

// POST 호출시  : 테이블 DATA Insert 쿼리   (입력페이지가 없어서 POSTMAN 으로 테스트 함!!)
app.post("/", (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");

  // body 입력값 대신 문자열 배열 입력값 저장
  const refs = [ '프로그램설계', 'DB 소프트웨어 개발', '서울특별시 강남구 역삼동', 'kudos12@naver.com','C:\down8', 'http://www.naver.com','설계개선','현재 가장 큰 문제점', '홍길동','010-2222-3212', 0 ]
 
  const InsertQuery = "INSERT INTO wp_homepage_info (businessType, detail, address, email, file, homePageAddress, interestedField, introduction, name, phoneNumber, sample ) VALUES(?)"

  connection.query(InsertQuery, [refs], (err, result) => {
      
      // res.send(result);
      // printRes(err, result);

      if(err) return res.json(err)
      return res.json("데이터 입력이 성공되었습니다!")
  });

});  


app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});

