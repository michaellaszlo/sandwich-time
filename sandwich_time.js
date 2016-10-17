var SandwichTime = (function () {
  'use strict';

  var slabPaint = {},
      dimensions = {
        width: 800,
        height: 600
      },
      max = Math.max,
      min = Math.min,
      canvases = {},
      contexts = {},
      level;

  slabPaint.tofu = function (context, offsetX, offsetY, slab) {
    var x = offsetX + slab.x,
        y = offsetY + slab.y,
        width = slab.width, height = slab.height;
    context.fillStyle = '#f7f2da';
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
    this.width = hopper.x + hopper.width;
    this.height = hopper.y + hopper.height;
  }
  Tower.prototype.paint = function (context) {
    var i, slab;
    contexts.background.fillStyle = '#30435c';
    contexts.background.fillRect(this.x, this.y, this.width, this.height);
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
  Level.prototype.paint = function () {
    var i, tower;
    // Background.
    contexts.background.fillStyle = this.color.background;
    contexts.background.fillRect(0, 0, this.width, this.height);
    // Towers.
    for (i = 0; i < this.towers.length; ++i) {
      tower = this.towers[i];
      tower.paint(contexts.tower);
    }
  };

  function makeRandomLevel(width, height) {
    var grid = new Grid(width, height),
        color = { background: '#073157' },
        gridArea = width * height,
        targetDensity = 0.15,
        numShuffleRounds = 10, i, j, k, a, b,
        spaceUp, spaceRight, spaceDown, spaceLeft, totalSpace, slide,
        towers = [],
        tower, towerArea = 0,
        x = 0;
    // Make towers and line them up along the bottom of the grid, starting from
    //  the left corner. Stop when the next tower won't fit or when target
    //  density is reached, whichever happens first.
    while (towerArea / gridArea < targetDensity) {
      tower = makeRandomTower(grid);
      if (x + tower.width > width) {
        break;
      }
      towerArea += tower.width * tower.height;
      towers.push(tower);
      tower.x = x;
      tower.y = height - tower.height;
      x += tower.width;
    }
    console.log(Math.round(100 * towerArea / gridArea) + '% tower density');
    // Shuffle the towers: slide them random distances in axial directions.
    for (i = 0; i < numShuffleRounds; ++i) {
      for (j = 0; j < towers.length; ++j) {
        a = towers[j];
        // Determine the maximum amount we could possibly slide this tower.
        spaceUp = a.y;
        spaceRight = width - (a.x + a.width);
        spaceDown = height - (a.y + a.height);
        spaceLeft = a.x;
        // See if another tower protrudes into the sliding lane.
        for (k = 0; k < towers.length; ++k) {
          if (k == j) {
            continue;
          }
          b = towers[k];
          // Up.
          if (b.y + b.height <= a.y) {
            if (max(a.x, b.x) < min(a.x + a.width, b.x + b.width)) {
              spaceUp = min(spaceUp, a.y - (b.y + b.height));
            }
          }
          // Right.
          if (b.x >= a.x + a.width) {
            if (max(a.y, b.y) < min(a.y + a.height, b.y + b.height)) {
              spaceRight = min(spaceRight, b.x - (a.x + a.width));
            }
          }
          // Down.
          if (b.y >= a.y + a.height) {
            if (max(a.x, b.x) < min(a.x + a.width, b.x + b.width)) {
              spaceDown = min(spaceDown, b.y - (a.y + a.height));
            }
          }
          // Left.
          if (b.x + b.width <= a.x) {
            if (max(a.y, b.y) < min(a.y + a.height, b.y + b.height)) {
              spaceLeft = min(spaceLeft, a.x - (b.x + b.width));
            }
          }
        }
        totalSpace = spaceUp + spaceRight + spaceLeft + spaceDown;
        slide = randrange(totalSpace + 1);
        if ((slide -= spaceUp) < 0) {
          a.y += slide;
        } else if ((slide -= spaceRight) < 0) {
          a.x -= slide;
        } else if ((slide -= spaceDown) < 0) {
          a.y -= slide;
        } else {
          a.x += (slide -= spaceLeft);
        }
      }
    }
    return new Level(grid, towers, color);
  }

  function load() {
    var box = document.getElementById('levelBox');
    box.style.width = dimensions.width + 8 + 'px';
    box.style.height = dimensions.height + 8 + 'px';
    [ 'background', 'tower', 'platform', 'overlay' ].forEach(function (name) {
      var canvas = canvases[name] = document.createElement('canvas');
      box.appendChild(canvas);
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      contexts[name] = canvas.getContext('2d');
    });
    level = makeRandomLevel(dimensions.width, dimensions.height);
    level.paint();
    console.log('ready');
  }

  return {
    load: load
  };
})();

window.onload = SandwichTime.load;
