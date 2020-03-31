
var d = new Date();
for(y = d.getFullYear(); y > 1850; y--) {
        var optn = document.createElement("OPTION");
        optn.text = y;
        optn.value = y;

        // if year is 2015 selected
        if (y == d.getFullYear()) {
            optn.selected = true;
        }

        document.getElementById('year').options.add(optn);
}
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
  });

  // Or with jQuery

$(document).ready(function(){
    $('select').formSelect();
  });
