# Sandwich Time


## An exercise in randomized two-dimensional layout

Sandwich Time is a web module that randomly generates a level layout for
a hypothetical game modeled on Burger Time. Laying out a functional and
aesthetically pleasing level is a challenging exercise in computational
geometry and numerical methods.


## Level composition

A level consists of rectangular sandwich **towers** connected by
horizontal **platforms** and vertical **ladders**. A sandwich tower
contains several **slabs** which depict edible sandwich layers.

When the player runs over a slab, it falls onto the next slab, which
falls onto the next, and so on. The lowest slab falls into a **hopper**
positioned below the tower. Once the player has caused all the slabs to
fall into the hopper, the sandwich is complete.


## Current status

Towers are generated uniformly at random until we reach a minimum total
area, also chosen uniformly at random. Initially the towers are packed
into the lower left corner. Then we move each tower by sliding it a
random distance along an axis direction. We iterate over the towers for
several rounds of random sliding.


## What's next

The immediate next step is to join the towers with platforms and ladders.

I'm also looking into better methods of building and positioning towers. I
want to achieve less uniformity in tower dimensions and more symmetrical
spacing between towers. One idea is to start with a fractal platform
layout and transform certain platform configurations into sandwich
towers. Another is to use graph-theoretical methods like those used to
generate mazes.


