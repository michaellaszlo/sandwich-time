var SandwichTime = (function () {
  'use strict';

  var slabPaint = {},
      dimensions = {
        width: 800,
        height: 600
      },
      level,
      canvas;

  slabPaint.tofu = function (context, offsetX, offsetY, slab) {
    var x = offsetX + slab.x,
        y = offsetY + slab.y,
        width = slab.width, height = slab.height;
    context.fillStyle = '#f7f2da';
    context.strokeStyle = '#57534b';
    context.strokeRect(x, y, width, height);
    context.fillRect(x, y, width, height);
  };

  // Slabs make up a sandwich. A slab can be a slice of bread or a filling.
  function Slab(x, y, width, height, paint) {
    var x, y, width, height, paint;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.paint = paint;
  }

  // A hopper is a container for slabs. It sits at the bottom of a sandwich
  //  tower and collects slabs as they fall, building up the sandwich.
  function Hopper(x, y, width, height, thickness) {
    var x, y, width, height, thickness;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.thickness = thickness;
  }
  Hopper.prototype.paint = function (context, offsetX, offsetY) {
    var x = offsetX + this.x,
        y = offsetY + this.y,
        thickness = this.thickness;
    context.fillStyle = '#7b775e';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x += thickness, y);
    context.lineTo(x, y += (this.height - thickness));
    context.lineTo(x += (this.width - 2*thickness), y); 
    context.lineTo(x, y -= (this.height - thickness));
    context.lineTo(x += thickness, y);
    context.lineTo(x, y += this.height);
    context.lineTo(x -= this.width, y);
    context.lineTo(x, y -= this.height);
    context.closePath();
    context.fill();
  };

  // A tower is a vertical sequence of slabs with a hopper at the bottom to
  //  collect the slabs as the player makes them fall. When the final slab
  //  falls into the hopper, the sandwich is complete.
  function Tower(slabs, hopper) {
    var slabs;
    this.slabs = slabs;
    this.hopper = hopper;
  }
  Tower.prototype.paint = function (context) {
    var i, slab;
    for (i = 0; i < this.slabs.length; ++i) {
      slab = this.slabs[i];
      slab.paint(context, this.x, this.y, slab);
    }
    this.hopper.paint(context, this.x, this.y);
  };

  // randrange is much like Python's random.randrange: it returns a random
  //  integer in the range [low, high). If only one argument is passed, it
  //  is taken as high and low is set to zero. Unlike the Python version,
  //  this function returns no error or warning if low >= high.
  function randrange(low, high) {
    if (high === undefined) {
      high = low;
      low = 0;
    }
    return low + Math.floor(Math.random() * (high - low));
  }

  function makeRandomTower(grid) {
    var slabs = [],
        paint = slabPaint.tofu,
        minNumSlabs = 2,
        maxNumSlabs = 5,
        slabHeight = 15, 
        minSlabWidth = 30,
        maxSlabWidth = 80,
        minGap = 30,
        maxGap = 60,
        hopperThickness = 8,
        numSlabs, slabWidth, hopperWidth, hopperHeight,
        i, slab, hopper, x, y, tower;
    // The local coordinates (x, y) designate a point within the tower's
    //  bounding rectangle. The top left corner is (0, 0).
    x = y = 0;
    // Move to the top left corner of the top slab.
    x += hopperThickness;
    slabWidth = randrange(minSlabWidth, maxSlabWidth);
    numSlabs = randrange(minNumSlabs, maxNumSlabs + 1);
    for (i = 0; i < numSlabs; ++i) {
      slab = new Slab(x, y, slabWidth, slabHeight, paint);
      slabs.push(slab);
      y += slabHeight + randrange(minGap, maxGap + 1);
    }
    // Move to the top left corner of the hopper.
    x -= hopperThickness;
    hopperWidth = 2*hopperThickness + slabWidth;
    hopperHeight = numSlabs*slabHeight + hopperThickness;
    hopper = new Hopper(x, y, hopperWidth, hopperHeight, hopperThickness);
    tower = new Tower(slabs, hopper);
    // Calculate the lower right corner of the bounding rectangle.
    tower.width = x + hopperWidth;
    tower.height = y + hopperHeight;
    return tower;
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
        color = { background: '#073157' },
        gridArea = width * height,
        minTowerDensity = 0.2,
        towers = [],
        tower, towerArea = 0,
        x, y, okay, i, other, minDistance;
    while (towerArea / gridArea < minTowerDensity) {
      tower = makeRandomTower(grid);
      towerArea += tower.width * tower.height;
      towers.push(tower);
      // Position the current tower without getting too close to
      //  earlier towers.
      minDistance = 0;
      okay = false;
      while (!okay) {
        okay = true;
        x = randrange(width - tower.width);
        y = randrange(height - tower.height);
        for (i = towers.length - 2; i >= 0; --i) {
          other = towers[i];
          if (x + tower.width + minDistance <= other.x ||
              other.x + other.width + minDistance <= x) {
            continue;
          }
          if (y + tower.height + minDistance <= other.y ||
              other.y + other.height + minDistance <= y) {
            continue;
          }
          okay = false;
          break;
        }
      }
      tower.x = x;
      tower.y = y;
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
