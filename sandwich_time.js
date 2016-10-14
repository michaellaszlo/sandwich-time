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
        towers = [
        ];
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
