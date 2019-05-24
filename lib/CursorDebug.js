import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import {
  event as domEvent,
} from 'min-dom';

var LAYER_NAME = 'cursor';

export default function CursorDebug(eventBus, canvas) {

  this._canvas = canvas;

  var self = this;

  function toPoint(event) {

    if (event.pointers && event.pointers.length) {
      event = event.pointers[0];
    }

    if (event.touches && event.touches.length) {
      event = event.touches[0];
    }

    return event ? {
      x: event.clientX,
      y: event.clientY
    } : null;
  }

  function toLocalPoint(globalPosition) {

    var viewbox = canvas.viewbox();

    var clientRect = canvas._container.getBoundingClientRect();

    return {
      x: viewbox.x + (globalPosition.x - clientRect.left) / viewbox.scale,
      y: viewbox.y + (globalPosition.y - clientRect.top) / viewbox.scale
    };
  }

  eventBus.on('diagram.init', function() {
    self._init();
  });

  domEvent.bind(document, 'mousemove', function(e) {
    var current = toPoint(e),
        localPoint = toLocalPoint(current);

    self._setCoordinates(localPoint);
  });

}

CursorDebug.prototype._init = function(event) {
  // create layer
  var parent = this._canvas.getLayer(LAYER_NAME, -2);

  // create box
  var box = this.box = svgCreate('text');

  svgAttr(box, {
    x: 150,
    y: 20,
    width: 50,
    height: 50
  });

  this._setCoordinates({ x: 0, y: 0 });

  svgAppend(parent, box);

};

CursorDebug.prototype._setCoordinates = function(point) {
  this.box.textContent = 'x: ' + point.x + ', y: ' + point.y;
};

CursorDebug.$inject = [
  'eventBus',
  'canvas'
];