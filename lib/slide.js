var indexOf = require('indexof');
var Emitter = require('emitter');
var classes = require('classes');

/**
 * A single slide element
 * @param {Element} el
 * @param {Observable} slides
 */
function Slide(el) {
  this.el = el;
  this.index = indexOf(el);
  this.classes = classes(this.el);
}

/**
 * Mixin Event emitter
 */
Emitter(Slide.prototype);

/**
 * Hide the slide from view
 * @return {void}
 */
Slide.prototype.hide = function(){
  this.classes.add('hide');
  return this;
};

/**
 * Show the slide
 * @return {void}
 */
Slide.prototype.show = function(){
  this.classes.remove('hide');
  return this;
};

/**
 * Position this slide in the previous position
 * @return {Slide}
 */
Slide.prototype.previous = function(){
  this.classes
    .remove('active')
    .remove('next')
    .add('previous');
  return this;
};

/**
 * Position this slide in the next position
 * @return {Slide}
 */
Slide.prototype.next = function(){
  this.classes
    .remove('active')
    .remove('previous')
    .add('next');
  return this;
};

/**
 * Position this slide in the active position
 * @return {Slide}
 */
Slide.prototype.active = function(){
  this.classes
    .remove('next')
    .remove('previous')
    .add('active');
  return this;
};

/**
 * Remove this slide from every position
 * @return {Slide}
 */
Slide.prototype.remove = function(){
  this.classes
    .remove('next')
    .remove('previous')
    .remove('active');
  return this;
};

/**
 * Exports
 */

module.exports = Slide;