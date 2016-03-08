var score = function(){
  students.push('mike');
  console.log(students.shift());
}

var students = [];
var papers = [];

score.prototype.main = function(req,res){
  res.write('score main page.');
  res.end();
}

module.exports = score;
