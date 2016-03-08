var express = require('express');
var router = express.Router();
//var Score = require('./score');
//var score = new Score();
var mysql = require('mysql');



//score main page ;
//list students and class;
function main(req,res){
  var students = [];
  var papers = [];
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });
  //acquire students info from database;
  db.query('select * from students',function(err,rows){
    if(err) throw err;
    for (var i in rows){
      students.push({
        id: rows[i].id,
        class: rows[i].class,
        name: rows[i].name
      });
    }



  });

  //acquire papers info from database;
  db.query('select * from papers',function(err,rows){
    if(err) throw err;
    for(var i in rows){
      papers.push({
        paperNum: rows[i].paperNum,
        paperName:  rows[i].paperName,
        paperMaker: rows[i].paperMaker
      });
    }
  });

  console.log('db is querying...');
  db.end();
  setTimeout(function(){
    res.render('scoreMain.ejs',{
      title: 'students and class info',
      students: students,
      papers: papers
    });
  },300);

  console.log('renderring...');

}

//get post to render the scoreStudent page
//and the scorePaper page;
function query(req,res){
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });
  var studentId = req.query.studentId;
  var paperNum = req.query.paperNum;
  if(studentId != undefined){
    //param is student,render the score_student page
    var student;
    var scores = [];
    //query student info;
    db.query('select * from students where id=?',[studentId],function(err,rows){
      if(err) throw err;
      student = rows[0];
    });
    //query scores info;
    db.query('select * from scores where id=?',[studentId],function(err,rows){
      if(err) throw err;
      for(var i in rows){
        scores.push({
          paperName:  rows[i].paperName,
          score:  rows[i].score
        });
      }
    });
    setTimeout(function(){
      res.render('scoreStudent.ejs',{
        title:  'student score info',
        student:  student,
        scores: scores
      });
    },300);

  }
  else if (paperNum != undefined) {
    //param is paper ,render the scorePaper page
    var paper;
    var scores = [];
    db.query('select * from papers where paperNum=?',[paperNum],function(err,rows){
      if(err) throw err;
      paper = rows[0];
    });
    db.query('select * from scores where paperNum=?',[paperNum],function(err,rows){
      if(err) throw err;
      for(var i in rows){
        scores.push({
          name: rows[i].name,
          score:  rows[i].score
        });
      }
    });
    setTimeout(function(){
      res.render('scorePaper.ejs',{
        title:  'paper score info',
        paper:  paper,
        scores:  scores
      });
    },300);

  }
  else{
    //param is wrong ,return err;
    res.status(err.status || 500);
    res.render('error', {
      message: 'paramter error',
      error: {}
    });
  }
  db.end();
}



/* GET home page. */
router.get('/', main);
router.get('/details',query);



module.exports = router;

/*var mysql = require('mysql');
var fs = require('fs');

var students = [];
var papers = [];

exports.main = function(req,res){
  //list main entry of score page;
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });

}
*/
