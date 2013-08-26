var Observable = require('observable');

/**
 * Collection of slides
 */
function Slides() {
  this.length = 0;
  this._slides = [];
  this.attr('current');
  this.attr('enabled');
  this.attr('direction');
}

/**
 * Mixin observable so we can use it like a model
 */

Observable(Slides.prototype);

/**
 * Add a new slide
 * @param {Slide} slide
 */
Slides.prototype.add = function(slide) {
  this.length++;
  this._slides.push(slide);
  var slides = this;
  slides.on('change current', function(current, previous){
    if(slide === current) return slide.active();
    if(slides.direction() === "backward" && slide === previous) return slide.next();
    if(slides.direction() === "forward" && slide === previous) return slide.previous();
    slide.remove();
  });
};

/**
 * Get a slide at an index
 * @param  {Number} index
 * @return {Slide}
 */
Slides.prototype.at = function(index) {
  return this._slides[index];
};

/**
 * Give it an index and get the index of the next slide
 *
 * @api public
 */
Slides.prototype.next = function() {
  var current = this.current();
  if(!current) return undefined;
  return this.at(current.index + 1) || this.first();
};

/**
 * Give it an index and get the index of the previous slide
 *
 * @api public
 */
Slides.prototype.previous = function() {
  var current = this.current();
  if(!current) return undefined;
  return this.at(current.index - 1) || this.last();
};

/**
 * Get the last slide
 * @return {Slide}
 */
Slides.prototype.last = function(){
  return this.at(this.length - 1);
};

/**
 * Get the first slide
 * @return {Slide}
 */
Slides.prototype.first = function(){
  return this.at(0);
};

/**
 * Exports
 */
module.exports = Slides;
