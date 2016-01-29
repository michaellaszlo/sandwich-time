var TofuTime = (function () {
  var levels = [
        {
          map: [
            '                     ',
            '                     ',
            ' xxxxxxxxxxxxxxxxxxx ',
            ' |    |      |     | ',
            ' |    |      |     | ',
            ' |    xxxxxxxx     | ',
            ' |         |       | ',
            ' |         |       | ',
            ' xxxx    xxxxxxxx  | ',
            '    |     |     |  | ',
            '    |     |     |  | ',
            '    xxxxxxx     |  | ',
            '    |           |  | ',
            '    |           |  | ',
            ' xxxxxxx      xxxxxx ',
            ' |     |      |    | ',
            ' |     |      |    | ',
            ' xxxxxxxxxxxxxxxxxxx '
          ]
        }
      ],
      currentLevel,
      size = {
        cell: 32,
        level: {},
        container: { border: 4 }
      },
      color = {
        background: '#e0d9a9',
        platform: { stroke: '#2b3648', fill: '#48576f' }
      },
      container = {},
      canvas = {},
      context = {};

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
        rLimit = currentLevel.numRows,
        cLimit = currentLevel.numCols;
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

  function paintLevel() {
    var level = currentLevel,
        platforms = level.platforms,
        i, platform,
        x0, y0, xSize, ySize,
        layer = context.furniture;
    layer.fillStyle = color.background;
    layer.fillRect(0, 0, size.level.width, size.level.height);
    layer.fillStyle = color.platform.fill;
    layer.strokeStyle = color.platform.stroke;
    layer.lineWidth = 1;
    for (i = 0; i < platforms.length; ++i) {
      platform = platforms[i];
      console.log('platform r', platform.rMin, 'c', platform.cMin,
          'length', platform.cMax - platform.cMin + 1);
      x0 = platform.cMin * size.cell;
      y0 = platform.rMin * size.cell;
      xSize = (platform.cMax - platform.cMin + 1) * size.cell;
      ySize = (platform.rMax - platform.rMin + 1) * size.cell;
      layer.fillRect(x0, y0, xSize, ySize);
      layer.strokeRect(x0, y0, xSize, ySize);
    }
  }

  function loadLevel(levelIndex) {
    var level = currentLevel = levels[levelIndex],
        map = level.map,
        numRows = level.numRows = map.length,
        numCols = level.numCols = map[0].length,
        platforms = level.platforms = [],
        ladders = level.ladders = [],
        flooded = new Array(numRows),
        thing,
        r, c, ch;
    size.level.width = numCols * size.cell;
    size.level.height = numRows * size.cell;
    for (r = 0; r < numRows; ++r) {
      flooded[r] = new Array(numCols);
    }
    for (r = 0; r < numRows; ++r) {
      for (c = 0; c < numCols; ++c) {
        if (flooded[r][c]) {
          continue;
        }
        ch = map[r][c];
        if (ch == 'x' || ch == '|') {
          thing = scanThingOnMap(flooded, ch, r, c);
          if (ch == 'x') {
            platforms.push(thing);
          }
        }
      }
    }
    container.game.style.width = size.level.width +
        2 * size.container.border + 'px';
    container.game.style.height = size.level.height +
        2 * size.container.border + 'px';
    Object.keys(canvas).forEach(function (name) {
      canvas[name].width = size.level.width;
      canvas[name].height = size.level.height;
    });
    paintLevel();
  }

  function load() {
    container.game = document.getElementById('gameBox');
    [ 'furniture', 'characters' ].forEach(function (name) {
      canvas[name] = document.createElement('canvas');
      context[name] = canvas[name].getContext('2d');
      container.game.appendChild(canvas[name]);
    });
    loadLevel(0);
    addMessage('Loaded.');
  }
  return {
    load: load
  };
})();

window.onload = TofuTime.load;
