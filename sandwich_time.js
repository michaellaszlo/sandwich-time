var SandwichTime = (function () {

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

  function load() {
    var slabs = [
          new Slab(5, 2, { x: 10, y: 5 }, null),
          new Slab(5, 2, { x: 10, y: 10 }, null)
        ],
        tower = new Tower(slabs);
    console.log(JSON.stringify(tower.slabs));
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
