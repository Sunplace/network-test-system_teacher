function confirmDelete(){
  var questionNum = document.getElementById('questionNum');
  var result = confirm('确认删除问题',questionNum.value);
  return result;
}
document.getElementById("questionNum").click=confirmDelete();
