
var cycs = document.getElementsByClassName("cycler");
var i;

for (i = 0; i < cycs.length; i++) {
  current = cycs[i];
  if (i == cycs.length - 1) {
    next = cycs[0];
  } else {
    next = cycs[i + 1];
  }



  function nextCycleSibling() {
    if (i == cycs.length - 1) {
      return cycs[0];
    }
    return cycs[i + 1];
  }


  current.addEventListener("click", function() {

    if (this.classList.contains('cycle-end')) {
      sibling = this.parentElement.children[1];
    } else {
      sibling = this.nextElementSibling;
    }
    this.classList.remove('cycle-current');
    sibling.classList.add('cycle-current');


  });
}
