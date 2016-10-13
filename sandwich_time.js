var SandwichTime = (function () {

  function addMessage(s) {
    document.getElementById('messageBox').innerHTML += s + '<br>';
  }
  function setMessage(s) {
    document.getElementById('messageBox').innerHTML = s + '<br>';
  }

  function load() {
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
