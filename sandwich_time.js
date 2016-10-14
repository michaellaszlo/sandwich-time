var SandwichTime = (function () {

  var level;

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

  function Level(grid, towers) {
    this.grid = grid;
    this.towers = towers;
  }

  function makeRandomLevel(width, height) {
    var grid = new Grid(width, height),
        towers = [],
        numTowers = 1,
        tower, i;
    for (i = 0; i < numTowers; ++i) {
      tower = makeRandomTower(grid);
      towers.push(tower);
    }
    return new Level(grid, towers);
  }

  function load() {
    level = makeRandomLevel(500, 800);
    console.log('ready');
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
