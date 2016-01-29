var TofuTime = (function () {
  var levels = [
    {
      map: [
        '   xxxxxx            ',
        '   |  |              ',
        '   |  xxxxxxx        ',
        '   |       |         ',
        '  xxxx   xxxxxxxx    ',
        '          |          ',
        '    xxxxxxxx         ',
        '                     '
      ]
    }
  ];

  function addMessage(s) {
    document.getElementById('messageBox').innerHTML += s + '<br>';
  }
  function setMessage(s) {
    document.getElementById('messageBox').innerHTML = s + '<br>';
  }

  function loadLevel(levelIndex) {
    var level = levels[levelIndex],
        map = level.map,
        numRows = map.length,
        numCols = map[0].length;
  }

  function load() {
    loadLevel(0);
    addMessage('Loaded.');
  }
  return {
    load: load
  };
})();

window.onload = TofuTime.load;
