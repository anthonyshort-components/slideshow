var classes = require('classes');
var Emitter = require('emitter');
var reactive = require('reactive');
var afterTransition = require('after-transition');
var events = require('event');
var tick = require('next-tick');
var Slide = require('./lib/slide');
var Slides = require('./lib/slides');

/**
 * Export
 */

module.exports = SlideShow;

/**
 * Create a slideshow
 * @param {Object} options
 */
function SlideShow(el) {
  if( !(this instanceof SlideShow) ) return new SlideShow(el);
  this.el = el;
  this.slides = new Slides();
  this.reactive = reactive(this.el, this.slides, this);
  this._bind();
}

/**
 * Mixin an emitter
 */

Emitter(SlideShow.prototype);

/**
 * Setup event bindings
 * @api private
 * @return {void}
 */
SlideShow.prototype._bind = function(){
  var self = this;
  var el = this.el;
  var slides = this.slides;

  this.reactive.bind('slide', function(el){
    var slide = new Slide(el);
    slides.add(slide);
  });

  this.reactive.bind('indicator', function(el, value, model){
    model.on('change current', function(current){
      el.classList.toggle('active', current == slides.at(value));
    });
    events.bind(el, 'click', function(){
      var slide = slides.at(value);
      if(slide.index < slides.current().index) {
        slides.direction('backward');
      }
      else {
        slides.direction('forward');
      }
      self.show(value);
    });
  });

  this.slides.set('direction', 'forward');
}

/**
 * Show a slide by its index. Also pass through a boolean
 * for whether to move the slideshow forward or backward
 * to reach the slide.
 *
 * @api public
 */

SlideShow.prototype.show = function(index) {
  if(this.slides.enabled() === false) return;
  this.slides.enabled(false);

  var slides = this.slides;
  var current = slides.current();
  var slide = slides.at(index);

  if(!current) {
    slide.hide();
    slides.current(slide);
    slide.show();
    slides.enabled(true);
  }
  else {

    afterTransition.once(current.el, function(){
      current.remove();
      slides.enabled(true);
    });

    // Reposition the slide in the correct position
    // for it's next animation. We hide it first to
    // prevent any animation from occuring while we move it
    if(slides.direction() === "forward") {
      slide.hide().next().show();
    }
    else {
      slide.hide().previous().show();
    }

    tick(function(){
      slides.current(slide);
    });
  }

  this.emit('show', slide, slides);
};

/**
 * Move to the next slide
 *
 * @api public
 */

SlideShow.prototype.next = function(){
  if(this.slides.enabled() === false) return false;
  this.slides.direction('forward');
  this.show(this.slides.next().index);
  this.emit('next');
};

/**
 * Move to the previous slide
 *
 * @api public
 */

SlideShow.prototype.previous = function(){
  if(this.slides.enabled() === false) return false;
  this.slides.direction('backward');
  this.show(this.slides.previous().index);
  this.emit('previous');
};