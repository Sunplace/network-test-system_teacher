var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var fs = require('fs');

//paper main page
//list all available paper;
function main(req,res){
  var papers = [];
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });

db.query('select * from papers;',function(err,rows){
  if(err) throw err;
  for(var i in rows){
    papers.push({
      paperNum: rows[i].paperNum,
      paperName:  rows[i].paperName,
      paperMaker: rows[i].paperMaker
    });
  }
  res.render('paperlist.ejs',{
    title:  'paperlist',
    papers: papers
  });
});
db.end();
}

//list specified paper's question list;
function paperQuestion(req,res){
  var paperNum = req.query.paperNum;
  var paperQuestions = [];
  var paperName;
  var questionsFile = [];
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });
  db.query('select * from paper_question where paperNum=?',[paperNum],function(err,rows){

    if(rows.length == 0){
      res.render('error', {
        message: '未添加试题',
        error: {}
      });
      return;
    }
    paperName = rows[0].paperName;
    for(var i in rows){
      paperQuestions.push({
        questionID: rows[i].questionID,
        questionType: rows[i].questionType
      });
      //read question file;
      fs.readFile(rows[i].questionFile,'utf8',function(err,data){
        if(err) throw err;
        questionsFile.push(data);
      });
    }

    setTimeout(function(){
      res.render('paperQuestion.ejs',{
        title:  'paperQuestion',
        paperName:  paperName,
        paperQuestions: paperQuestions,
        questionsFile:  questionsFile
      });
    },300);

  });

  db.end();
}

router.get('/', main);
router.get('/details',paperQuestion);



module.exports = router;
