//var fs = require('fs');
var mysql = require('mysql');
var fs = require('fs');
//var question = function(){
  //var questions = [];    //question list;

  //connect database;

//}

var questions = [];

exports.listquestion = function(req,res){
  //list question;
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });

  questions.splice(0,questions.length);
  //clear questions array;
  db.query('select * from questionlist order by questionID',function(err,rows){
    if(err) throw err;
    for (var i in rows){


      /*fs.readFile(rows[i].questionFile,'utf8',function(err,data){
        if(err) throw err;
        //file += data;       //read file;
        console.log(data);
        questions.push({
          questionID: rows[i].questionID,
          questionType: rows[i].questionType,
          questionFile: data
        });
        console.log(questions[0].questionFile);
        //console.log(data);
      });*/
      questions.push({
        questionID: rows[i].questionID,
        questionType: rows[i].questionType,
        questionFile: rows[i].questionFile
      });



    }//for loop;
    //console.log(questions[0].questionID);
    //console.log(questions[0].questionType);
    //console.log(questions[0].questionFile);
    //console.log('hello,read rows end');
    var questionsFile = [];//= readFiles(questions);
    /*res.render('questionlist.ejs',{
      title: 'question list',
      questions:  questions,
      questionsFile:  questionsFile
    });*/
    /*setTimeout(function(){
      res.render('questionlist.ejs',{
        title: 'question list',
        questions:  questions,
        questionsFile:  questionsFile
      });
    },500);*/

    setTimeout(function(){
      questionsFile = readFiles(questions);
      setTimeout(function(){
        res.render('questionlist.ejs',{
          title: 'question list',
          questions:  questions,
          questionsFile:  questionsFile
        });
      },100);

    },100);


});//db.query;

db.end();
}//questionlist function;

function readFiles(questions){
  var questionsFile = [];
  var n = 0;
  for(var i in questions){
    fs.readFile(questions[i].questionFile,'utf8',function(err,data){
      if(err) throw err;
      console.log(data);
      questionsFile.push(data);
      console.log(questionsFile[n]);
      n++;
    });
  }
  //console.log(questionsFile);
  return questionsFile;

}//readFile function;

exports.addquestion = function(req,res){
  res.render('addquestion.ejs');
  //send the rendered page to the client;
}

//module.exports = question;
exports.deletequestion = function(req,res){
  //delete function
  //th id of question that request to delete;
  var questionID = req.body.questionID;
  var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'aigo'
  });
  db.query('select questionFile from questionlist where questionID = ?',[questionID],function(err,rows){
    var questionFile = rows[0].questionFile;
    //query is filepath in order to delett it;
    fs.unlink(questionFile,function(err){
      if(err) throw err;
      console.log('delete file:' + questionFile + ' successfully.');
    });
    //delete it's database record;

  });
  db.query('delete from questionlist where questionID = ?',[questionID],function(err){
    if(err) throw err;
    console.log('delete question:' + questionID + '\'s record from database successfully.');
    res.redirect('/question');
  });

  db.end();

  //refresh the questionlist page;

}

//modify specified question;
exports.modifyquestion = function(req,res){
  //
  var questionID = req.query.questionID;    //?name=value. acquire value.
  var questionFile ;
  for(var i in questions){
    if(questionID == questions[i].questionID){
      questionFile = questions[i].questionFile;
    }
  }
  fs.readFile(questionFile,function(err,data){
    res.render('modifyquestion.ejs',{
      title:  'questionfile',
      data: data,
      id: questionID
    });
  });
}


//submitmodify to modifyquestion page use method post;
exports.submitmodify = function(req,res){
  var data = req.body.questionFile;     //modified text;
  var id = req.body.questionID;         //the question's id that request to modify;
  var questionFile ;
  for(var i in questions){
    if(id == questions[i].questionID){
      questionFile = questions[i].questionFile;
    }
  }
  fs.writeFile(questionFile,data,function(err){
    if(err) throw err;
    console.log('writefile successfully.');
  });
  res.redirect('/question');
}

//submit added question;
//add this to database;
exports.submitadding = function(req,res){
  var type = req.body.questionType;
  //question type;
  var file = req.body.questionFile;
  //question main file,discribe the details of question;
  var fileNum = Math.round(Math.random()*100);
  var filePath = '/home/aigo/tmp/' + fileNum + '.txt';
  fs.writeFile(filePath,file,function(err){
    //add question file.
    if(err) throw err;
    console.log('writefile successfully.');
    //add the database record;
    var db = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'aigo'
    });
    db.query("insert into questionlist (questionID,questionType,questionFile)" +
      "value (?,?,?)",[fileNum,type,filePath],function(err){
        if(err) throw err;
        console.log('add database record successfully.');
        res.redirect('/question');
      });
    db.end();
  });

}
