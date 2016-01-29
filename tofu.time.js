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
      ],
      currentLevel;

  function addMessage(s) {
    document.getElementById('messageBox').innerHTML += s + '<br>';
  }
  function setMessage(s) {
    document.getElementById('messageBox').innerHTML = s + '<br>';
  }

  function flood(flooded, cells, ch, r, c) {
    var dr = [ -1, 0, 1, 0 ],
        dc = [ 0, 1, 0, -1 ],
        i, R, C,
        map = currentLevel.map,
        rLimit = currentLevel.height,
        cLimit = currentLevel.width;
    flooded[r][c] = true;
    cells.push({ r: r, c: c });
    for (i = 0; i < 4; ++i) {
      R = r + dr[i];
      C = c + dc[i];
      if (R == -1 || R == rLimit || C == -1 || C == cLimit) {
        continue;
      }
      if (flooded[R][C] || map[R][C] != ch) {
        continue;
      }
      flood(flooded, cells, ch, R, C);
    }
  }

  function scanThingOnMap(flooded, ch, r, c) {
    var cells = [],
        i, rMin, rMax, cMin, cMax;
    flood(flooded, cells, ch, r, c);
    rMin = rMax = cells[0].r;
    cMin = cMax = cells[0].c;
    for (i = 0; i < cells.length; ++i) {
      cell = cells[i];
      rMin = Math.min(rMin, cell.r);
      rMax = Math.max(rMax, cell.r);
      cMin = Math.min(cMin, cell.c);
      cMax = Math.max(cMax, cell.c);
    }
    return {
      cells: cells,
      rMin: rMin, rMax: rMax,
      cMin: cMin, cMax: cMax
    };
  }

  function loadLevel(levelIndex) {
    var level = currentLevel = levels[levelIndex],
        map = level.map,
        height = level.height = map.length,
        width = level.width = map[0].length,
        platforms = [],
        ladders = [],
        flooded = new Array(height),
        thing,
        r, c, ch;
    for (r = 0; r < height; ++r) {
      flooded[r] = new Array(width);
    }
    for (r = 0; r < height; ++r) {
      for (c = 0; c < width; ++c) {
        if (flooded[r][c]) {
          continue;
        }
        ch = map[r][c];
        if (ch == 'x' || ch == '|') {
          thing = scanThingOnMap(flooded, ch, r, c);
          if (ch == 'x') {
            console.log('platform', 'r', thing.rMin, 'c', thing.cMin,
                'length', thing.cMax - thing.cMin + 1);
          } else {
          }
        }
      }
    }
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
