var model = {
  size: 15,
  grid: { },

  init: function() {
    // need to get initial location here

    this.snake = new this.Snake( 5, 7);
    this.addSnakeToGrid();
  },

  Snake: function ( startX, startY ) {
    this.tail = new model.BodyPart( 'up', startX - 1, startY - 1, 'tail', null );
    this.body = new model.BodyPart( 'right', startX - 1, startY,'body', this.tail   );
    this.head = new model.BodyPart( 'right', startX, startY, 'head', this.body  );
    this.bodyParts = [this.head, this.body, this.tail];
  },

  addSnakeToGrid: function() {
    var bodypart = this.snake.head;
    while( bodypart ) {
      this.addItemToGrid( bodypart )
      bodypart = bodypart.next;
    }
  },

  removeSnakeFromGrid: function() {
    this.grid = {}
    var bodypart = this.snake.head;
    while( bodypart ) {
      this.revmoveItemFromGrid( bodypart );
      bodypart = bodypart.next;
    }
  },


  moveSnakeHead: function( direction) {
    this.snake.head.orientation = direction;
    switch(direction){
      case 'up':
        this.snake.head.y += 1;
        break;
      case 'down':
        this.snake.head.y -= 1;
        break;
      case 'left':
        this.snake.head.x -= 1;
        break;
      case 'right':
        this.snake.head.x += 1;
        break;
    }
  },


  moveSnake: function( direction ) {
    this.removeSnakeFromGrid();

    for (var i = this.snake.bodyParts.length - 1; i > 0; --i) {
      var bodyPart = this.snake.bodyParts[i];
      var nextBodyPart = this.snake.bodyParts[i-1]
      bodyPart.x = nextBodyPart.x;
      bodyPart.y = nextBodyPart.y;
      bodyPart.orientation = nextBodyPart.orientation;
    }

    this.moveSnakeHead(direction);
    this.addSnakeToGrid();
  },

  addItemToGrid: function(item) {
    this.addToGrid(item.x, item.y, item);
  },

  revmoveItemFromGrid: function(item) {
    this.removeFromGrid( item.x, item.y );
  },

  gridGet: function(x, y) {
    return this.grid[x.toString() + ',' + y.toString()];
  },

  addToGrid: function(x, y, value) {
    this.grid[x.toString() + ',' + y.toString()] = value;
  },

  removeFromGrid: function(x, y) {
    this.grid[x.toString() + ',' + y.toString()] = null;
  },


  BodyPart: function (orientation, x, y, type, next) {
    this.orientation = orientation;
    this.x = x;
    this.y = y;
    this.type = type;
    this.next = next
  }




};

var controller = {
  gridSize: model.size,

  moveSnake: function(direction) {
    model.moveSnake(direction);
    view.render();
  },

  objectAt: function(x,y) {
    return model.gridGet(x,y);
  },

  init: function() {
    model.init();
    view.init();
  },
};

var view = {

  init: function() {
    this.render();
  },

  render: function() {
    $('#grid').html("");
    for (var y = controller.gridSize - 1; y >= 0; --y) {
      var row = $("<div class='row'></div>");
      for (var x = 0; x < controller.gridSize; ++x) {
        var cell = $("<div class='cell'></div>");
        var object = controller.objectAt(x,y);

        if (object) {
          cell.addClass(object.type);
          cell.addClass(object.orientation);
        }

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
  window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 37: // Left
        controller.moveSnake('left')
          break;

      case 38: // Up
        controller.moveSnake('up')
          break;

      case 39: // Right
        controller.moveSnake('right')
          break;

      case 40: // Down
        controller.moveSnake('down')
          break;
    }
  }, false);
});
