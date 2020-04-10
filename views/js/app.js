
function load_monitor(){

  M.textareaAutoResize($('#textarea1'));

}
console.log("In load Monitor");
var d = new Date();
for(y = d.getFullYear(); y > 1850; y--) {
        var optn = document.createElement("OPTION");
        optn.text = y;
        optn.value = y;

        if (y == d.getFullYear()) {
            optn.selected = true;
        }
        document.getElementById('year').options.add(optn);
}
function EditReview(){
  console.log("here");
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {dismissible: false, startingTop:'1%', endingTop:'0%'});
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems);
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});
// Or with jQuery

$(document).ready(function(){
  $('.modal').modal();
});


  // Or with jQuery

$(document).ready(function(){
    $('select').formSelect();
  });

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
    });
});
