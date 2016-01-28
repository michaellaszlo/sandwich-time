var TofuTime = (function () {

  function addMessage(s) {
    document.getElementById('messageBox').innerHTML += s + '<br>';
  }
  function setMessage(s) {
    document.getElementById('messageBox').innerHTML = s + '<br>';
  }

  function load() {
    addMessage('Ready.');
  }
  return {
    load: load
  };
})();

window.onload = TofuTime.load;
