var model = {
  size: 15,

  grid: { '4,4': 4 },

  init: function() {

  },

  gridGet: function(x, y) {
    return this.grid[x.toString() + ',' + y.toString()];
  },

  bodyPart: function BodyPart(orientation, x, y, type, next) {
    this.orientation = orientation;
    this.x = x;
    this.y = y;
    this.type = type;
    this.next = next
  }

};

var controller = {
  gridSize: model.size,

  init: function() {
    view.init()
  },
};

var view = {

  init: function() {
    this.render();
  },

  render: function() {
    for (var x = 0; x < controller.gridSize; ++x) {
      var row = $("<div class='row'></div>");
      for (var y = 0; y < controller.gridSize; ++y) {
        var cell = $("<div class='cell'></div>");
        cell.data('x', x.toString());
        cell.data('y', y.toString());
        row.append(cell);
      }
      $('#grid').append(row);
    }
  }
};

$(document).ready(function(){
  controller.init();
});
