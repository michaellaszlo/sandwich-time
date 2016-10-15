var SandwichTime = (function () {

  var level,
      canvas;

  function Slab(width, height, upperLeft, paint) {
    var width, height, upperLeft, paint;
    this.width = width;
    this.height = height;
    this.upperLeft = upperLeft;
    this.paint = paint;
  }

  function Tower(slabs) {
    var numSlabs,
        slabs;
    this.numSlabs = slabs.length;
    this.slabs = slabs;
  }

  function makeRandomTower(grid) {
    var slabs = [],
        numSlabs = 3,
        width = 5 + Math.floor(grid / 10 * Math.random()),
        height = 4,
        x = 10, y = 10,
        i, slab;
    for (i = 0; i < numSlabs; ++i) {
      slab = new Slab(width, 4, { x: x + i * 30, y: y }, null);
      slabs.push(slab);
    }
    return new Tower(slabs);
  }

  function Grid(width, height) {
    this.width = width;
    this.height = height;
  }

  function Level(canvas, grid, towers) {
    this.canvas = canvas;
    this.grid = grid;
    this.towers = towers;
    canvas.width = grid.width;
    canvas.height = grid.height;
  }
  Level.prototype.paint = function () {
    var context = this.canvas.getContext('2d');
  };

  function makeRandomLevel(width, height) {
    var grid = new Grid(width, height),
        towers = [],
        numTowers = 1,
        tower, i;
    for (i = 0; i < numTowers; ++i) {
      tower = makeRandomTower(grid);
      towers.push(tower);
    }
    return new Level(canvas, grid, towers);
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
