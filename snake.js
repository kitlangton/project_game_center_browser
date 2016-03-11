var model = {
  size: 15,
  gameState: 'running',
  grid: { },
  direction: 'right',

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

  extendBody: function() {
    var tail = this.snake.tail;
    var newTail = new model.BodyPart( 'up', 0, 0, 'tail');
    tail.next = newTail;
    tail.type = 'body';
    this.snake.tail = newTail;
    this.snake.bodyParts.push(newTail);
  },

  removeSnakeFromGrid: function() {
    this.grid = {}
    var bodypart = this.snake.head;
    while( bodypart ) {
      this.revmoveItemFromGrid( bodypart );
      bodypart = bodypart.next;
    }
  },

  getNewSnakeHeadPosition: function() {
    var position = {
      x: this.snake.head.x,
      y: this.snake.head.y
    };

    switch(this.direction){
      case 'up':
        position.y = this.snake.head.y + 1;
        if(position.y >= this.size ) {
          this.gameState = 'finished'
        }
        break;
      case 'down':
        position.y = this.snake.head.y - 1;
        if( position.y < 0 ) {
          this.gameState = 'finished'
        }
        break;
      case 'left':
        position.x = this.snake.head.x - 1;
        if(position.x < 0 ) {
          this.gameState = 'finished'
        }
        break;
      case 'right':
        position.x = this.snake.head.x + 1;
        if(position.x >= this.size ) {
          this.gameState = 'finished'
        }
        break;
    }
    return position;
  },


  moveSnake: function() {
    var position = this.getNewSnakeHeadPosition();
    if( this.gameState === 'fininshed' ) {
      return "game over";
    }

    this.removeSnakeFromGrid();

    var snakeGridPoints = [];

    for (var i = this.snake.bodyParts.length - 1; i > 0; --i) {
      var bodyPart = this.snake.bodyParts[i];
      bodyPart.order = i
      var nextBodyPart = this.snake.bodyParts[i-1]
      bodyPart.x = nextBodyPart.x;
      bodyPart.y = nextBodyPart.y;

      var positionString = bodyPart.x.toString() + ',' + bodyPart.y.toString();
      if( snakeGridPoints.indexOf(positionString) !== -1 ) {
        console.log('im here');
        this.gameState = 'finished';
      }

      snakeGridPoints.push( positionString );
      bodyPart.orientation = nextBodyPart.orientation;
    }

    // this.moveSnakeHead();
    this.snake.head.orientation = this.direction;
    this.snake.head.x = position.x;
    this.snake.head.y = position.y;

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
    this.next = next;
    this.order = 0;
  }
};




var controller = {
  gridSize: model.size,

  setDirection: function(direction) {
    if (direction == 'down') {
      model.extendBody();
    }
    model.direction = direction;
    view.render();
  },

  objectAt: function(x,y) {
    return model.gridGet(x,y);
  },

  init: function() {
    model.init();
    view.init();
    setInterval(function() {
      if( model.gameState !== 'finished' ) {
        model.moveSnake();
        view.render();
      }
    },150);
  },
};

var view = {

  init: function(){
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
          cell.css('zIndex', object.order);
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
        controller.setDirection('left')
          break;

      case 38: // Up
        controller.setDirection('up')
          break;

      case 39: // Right
        controller.setDirection('right')
          break;

      case 40: // Down
        controller.setDirection('down')
          break;
    }
  }, false);
});
