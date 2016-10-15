var SandwichTime = (function () {

  var slabPaint = {},
      level,
      canvas;

  slabPaint.tofu = function (context, slab) {
    var x = slab.x, y = slab.y,
        width = slab.width, height = slab.height;
    context.fillStyle = '#f7f2da';
    context.strokeStyle = '#57534b';
    context.strokeRect(x, y, width, height);
    context.fillRect(x, y, width, height);
  };

  function Slab(x, y, width, height, paint) {
    var x, y, width, height, paint;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.paint = paint;
  }

  function Tower(slabs) {
    var slabs;
    this.slabs = slabs;
  }

  function makeRandomTower(grid) {
    var slabs = [],
        numSlabs = 3,
        width = 25 + Math.floor(Math.random() * grid.width / 10),
        height = 15,
        gap = 30,
        x = Math.floor(Math.random() * (grid.width - width)),
        totalHeight = numSlabs * (height + gap) - gap,
        y = Math.floor(Math.random() * totalHeight),
        paint = slabPaint.tofu,
        i, slab;
    for (i = 0; i < numSlabs; ++i) {
      slab = new Slab(x, y + i * (height + gap), width, height, paint);
      slabs.push(slab);
    }
    return new Tower(slabs);
  }

  function Grid(width, height) {
    this.width = width;
    this.height = height;
  }

  function Level(canvas, grid, towers, color) {
    this.canvas = canvas;
    this.grid = grid;
    this.towers = towers;
    this.color = color;
    this.width = canvas.width = grid.width;
    this.height = canvas.height = grid.height;
  }
  Level.prototype.paint = function () {
    var context = this.canvas.getContext('2d'),
        i, tower, j, slab;
    // Background.
    context.fillStyle = this.color.background;
    context.fillRect(0, 0, this.width, this.height);
    console.log(0, 0, this.width, this.height);
    // Towers.
    for (i = 0; i < this.towers.length; ++i) {
      tower = this.towers[i];
      for (j = 0; j < tower.slabs.length; ++j) {
        slab = tower.slabs[j];
        slab.paint(context, slab);
      }
    }
  };

  function makeRandomLevel(width, height) {
    var grid = new Grid(width, height),
        towers = [],
        numTowers = 1,
        tower, i,
        color = { background: '#073157' };
    for (i = 0; i < numTowers; ++i) {
      tower = makeRandomTower(grid);
      towers.push(tower);
    }
    return new Level(canvas, grid, towers, color);
  }

  function load() {
    canvas = document.createElement('canvas');
    document.getElementById('levelBox').appendChild(canvas);
    level = makeRandomLevel(750, 500);
    level.paint();
    console.log('ready');
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
