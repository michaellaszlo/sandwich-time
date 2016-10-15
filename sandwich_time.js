var SandwichTime = (function () {
  'use strict';

  var slabPaint = {},
      dimensions = {
        width: 750,
        height: 500
      },
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

  function Tower(slabs, hopper) {
    var slabs;
    this.slabs = slabs;
    this.hopper = hopper;
  }
  Tower.prototype.paint = function (context) {
    var i, slab;
    for (i = 0; i < this.slabs.length; ++i) {
      slab = this.slabs[i];
      slab.paint(context, slab);
    }
    this.hopper.paint(context);
  };

  function Hopper(x, y, width, height, thickness) {
    var x, y, width, height, thickness;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
  }
  Hopper.prototype.paint = function (context) {
    context.fillStyle = '#ceb4bf';
    console.log(this.x, this.y, this.width, this.height);
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  function makeRandomTower(grid) {
    var slabs = [],
        numSlabs = 3,
        slabWidth = 25 + Math.floor(Math.random() * grid.width / 10),
        slabHeight = 15,
        slabGap = 30,
        hopperThickness = 10,
        x = Math.floor(Math.random() * (grid.width - slabWidth)),
        totalHeight = numSlabs*(2*slabHeight + slabGap) + hopperThickness,
        y = grid.height - totalHeight,
        hopper,
        paint = slabPaint.tofu,
        i, slab;
    for (i = 0; i < numSlabs; ++i) {
      slab = new Slab(x, y, slabWidth, slabHeight, paint);
      slabs.push(slab);
      y += slabHeight + slabGap;
    }
    hopper = new Hopper(x - hopperThickness, y,
        2*hopperThickness + slabWidth, numSlabs*slabHeight + hopperThickness,
        hopperThickness);
    return new Tower(slabs, hopper);
  }

  function Grid(width, height) {
    this.width = width;
    this.height = height;
  }

  function Level(grid, towers, color) {
    this.grid = grid;
    this.towers = towers;
    this.color = color;
    this.width = grid.width;
    this.height = grid.height;
  }
  Level.prototype.paint = function (context) {
    var i, tower;
    // Background.
    context.fillStyle = this.color.background;
    context.fillRect(0, 0, this.width, this.height);
    // Towers.
    for (i = 0; i < this.towers.length; ++i) {
      tower = this.towers[i];
      tower.paint(context);
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
    return new Level(grid, towers, color);
  }

  function load() {
    canvas = document.createElement('canvas');
    document.getElementById('levelBox').appendChild(canvas);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    level = makeRandomLevel(dimensions.width, dimensions.height);
    level.paint(canvas.getContext('2d'));
    console.log('ready');
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
