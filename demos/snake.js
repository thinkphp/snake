var Snake = new Class({

    /* implements */
    Implements: [Options, Events],

    /* set options */
    options: {
      divId: 'snake',
      width: 15,
      height: 15,
      scoreId: 'score',
      timeId: 'time',
      highScoreId: 'high-score',
      resetId: 'reset-high-score',
      speedPrefixId: 'speed-'        
    },

    /* constructor of class */
    initialize: function(options) {

           /*set options method */
           this.setOptions(options);          
           this.div = document.id(this.options.divId);
           this.scoreField = document.id(this.options.scoreId);
           this.timeField = document.id(this.options.timeId);
           this.highScoreField = document.id(this.options.highScoreId);
           this.resetButton = document.id(this.options.resetId);
        
           var speeds = [{speed: 'slow', value: 200}, {speed: 'medium', value: 150}, {speed: 'fast', value: 100}];
           this.table = '';

           this.timeout = '';
           this.inGame = false;
           this.snake = '';
           this.apple = '';
           this.score = 0;
           this.startTime = 0;
           this.gameDuration = 1;
    
           /* init */
           this.createTable();

           /*display high score */
           this.displayHighScore();

          /* Bind the buttons speed at right click events */
          for(var i=0,j=speeds.length; i<j; i++) {
              $(this.options.speedPrefixId + speeds[i].speed).onclick = (function(i,d,t) {
                     var self = t;
                     return function(){
                       self.timeout = d;
                       if(!self.inGame) {
                          self.startGame();  
                       }
                       return false;
                     }
              })(i,speeds[i].value,this);
          } 

           this.timeout = speeds[2].value;

           var self = this; 

           //add handler to the keydown events keys(down,up,right,left) ie. bind the keyboard
           document.onkeydown = function(e) {
                var e = e || window.event;

                switch(e.keyCode) {
                     //press left
                     case 37:  
                     if(self.inGame && self.snake.heading != 'right') {
                        self.snake.heading = 'left';
                     }
                     break;

                     //press right
                     case 39:
                     if(self.inGame && self.snake.heading != 'left') {
                        self.snake.heading = 'right';
                     }
                     break;

                     case 38:
                     if(self.inGame && self.snake.heading != 'down') {
                        self.snake.heading = 'up';
                     }
                     break;

                     case 40:
                     if(self.inGame && self.snake.heading != 'up') {
                        self.snake.heading = 'down';
                     }
                     break;
                }//end switch

           }//end handler for keydown event.

           
           this.resetButton.addEvent('click',function(e) {
                if(e) {e.stop()};
                self.burn('reset score'); 
                self.setHighScore(0);
                self.displayHighScore()                   
           });
 
           this.logger = document.id('logger');  
           this.fx = new Fx.Morph(this.logger,{duration: 1000});

    },
    createTable: function() {
               this.table = document.createElement('table');

               for(var y=0; y < this.options.height; y++) {
                   var row = this.table.insertRow(y);
                   for(var x=0; x < this.options.width; x++) {
                       var col = row.insertCell(x);
                   } 
               }  
               this.div.appendChild(this.table);
    },
    clearTable: function() {
               for(var y=0; y < this.options.height; y++) {
                   var row = this.table.rows[y];
                   for(var x=0; x < this.options.width; x++) {
                       row.cells[x].className = '';
                   } 
               }  
    },
    getRandomCellApple: function() {
               var cell = {};
               while(!cell.x || !cell.y || !cell.tableCell || cell.tableCell.className != '') {
                   cell.x = Math.floor(Math.random() * this.options.width);
                   cell.y = Math.floor(Math.random() * this.options.height);
                   cell.tableCell = this.table.rows[cell.y].cells[cell.x]; 
               }
              return cell;
    },
    generateApple: function() {
               this.apple = this.getRandomCellApple();
               this.apple.tableCell.className = 'apple';
    },
    generateSnake: function() {
               this.snake = {};
               this.snake.heading = 'right';
               this.snake.segments = [{x: Math.floor(this.options.width/2), y: Math.floor(this.options.height/2)}]; 
               this.snake.segments[0].tableCell = this.table.rows[this.snake.segments[0].y].cells[this.snake.segments[0].x]
               this.snake.segments[0].tableCell.className = 'snake-segment'; 
               this.snake.segmentHeadIndex = 0;
    },
    startGame: function() {
                 this.burn('start'); 
                 this.inGame = true;
                 this.score = 0;
                 this.startTime = new Date().getTime();
                 this.displayScore();
                 this.displayTime();
                 this.clearTable();
                 this.generateSnake();
                 this.generateApple();
                 this.move.delay(this.timeout, this); 
    },
    move: function() {
                  var snakeHead = this.snake.segments[this.snake.segmentHeadIndex],
                      nextCell = {x: snakeHead.x, y: snakeHead.y};

                      this.displayTime(); 
                      /* apply directional heading to nextCell */
                      switch(this.snake.heading) {
                          case 'left':
                          nextCell.x--; 
                          break;

                          case 'right':
                          nextCell.x++; 
                          break;

                          case 'down':
                          nextCell.y++; 
                          break;

                          case 'up':
                          nextCell.y--; 
                          break;
                      } 
                 
                 if(this.checkSegmentAgainstBoundsAndSelf(nextCell)) {
                    
                    nextCell.tableCell = this.table.rows[nextCell.y].cells[nextCell.x];  

                    if(this.checkSegmentAgainstApple(nextCell)) {
                      this.burn('health'); 
                      this.score++;
                      this.displayScore();
                      this.addSegmentToHead(nextCell);
                      this.generateApple(); 
                    } else {
                      this.movin(nextCell);                      
                    }                  
     
                    this.move.delay(this.timeout, this); 
                 } else {
                   this.endGame();
                 }                  
    },   

    /* returns TRUE if segment at same cell as the apple. */ 
    checkSegmentAgainstApple: function(segment) {
                if(segment.x == this.apple.x && segment.y == this.apple.y) {
                   return true; 
                }  
             return false;
    }, 

    /* check the segment position against bounds and itself . retuns false for invalid. */
    checkSegmentAgainstBoundsAndSelf: function(segment) {
                if(segment.x < 0 || segment.y < 0 || segment.x >= this.options.width || segment.y >= this.options.height) {
                    return false;
                }  
                for(var i=0,j=this.snake.segments.length;i<j;i++) {
                    if(segment.x == this.snake.segments[i].x && segment.y == this.snake.segments[i].y) {
                       return false; 
                    }
                } 
             return true;
    }, 
           
    grayOutBoard: function() {
              for(var i=0,j=this.snake.segments.length;i<j;i++) {
                      this.snake.segments[i].tableCell.className = 'dead';
              }
              if(this.apple) {
                 this.apple.tableCell.className = 'dead';
              }
    },

 
    endGame: function() {
              this.burn('end game');
              this.inGame = false;
              this.grayOutBoard();
              this.checkAndSetHighScore();
              this.displayHighScore(); 
    },

    movin: function(segment) {

              var newHeadIndex = this.snake.segmentHeadIndex;

              newHeadIndex--;
              if(newHeadIndex < 0) {
                  newHeadIndex = this.snake.segments.length - 1;   
              }

              this.snake.segments[newHeadIndex].tableCell.className = '';
              segment.tableCell.className = 'snake-segment';
              this.snake.segments[newHeadIndex] = segment;
              this.snake.segmentHeadIndex = newHeadIndex;
    },  
    addSegmentToHead: function(segment) {

              var newSegments = new Array(this.snake.segments.length + 1);
              newSegments[0] = segment;
              /* copy over the remaining segments */    
              for(var i=0,j=this.snake.segments.length;i<j;i++) {
                      var k = i + this.snake.segmentHeadIndex;
                      if(k>=this.snake.segments.length) {k -= this.snake.segments.length;} 
                      newSegments[i+1] = this.snake.segments[k];   
              }
              
              this.snake.segments = newSegments;
              this.snake.segmentHeadIndex = 0;
              this.snake.segments[0].tableCell.className = 'snake-segment';
     }, 
     displayScore: function() {
             this.scoreField.set('text',this.score);
     },
     checkAndSetHighScore: function() {
               var highScore = this.getHighScore();
               if(this.score > highScore) {
                  this.setHighScore(this.score);    
               } 
     },
     setHighScore: function(score) {
               document.cookie = 'snake-high-score=' + score + '; expires=Fri, 31 Dec 23:59:59 GMT;'; 
     },
     displayHighScore: function() {
               this.highScoreField.set('html',this.getHighScore());
     },
     /* returns 0 if no highscore set */
     getHighScore: function() {

               var key = 'snake-high-score';
               var startIndex = document.cookie.indexOf(key + '=');

               if(startIndex > -1) {
                  var endIndex = document.cookie.indexOf(';', startIndex);
                  if(endIndex == -1) endIndex = document.cookie.length;
                 return document.cookie.substring(startIndex + key.length + 1, endIndex); 
               }

            return 0; 
     },
     displayTime: function() {
              this.gameDuration = Math.floor((new Date().getTime() - this.startTime) / 1000);
              this.timeField.set('text', this.gameDuration + 's'); 
     },
     burn:function(text) { 
              this.logger.set('text',text);
              this.fx.start({
                'background-color': ['#fff36f', '#fff'],
                'opacity': [1, 0] 
              });  
     }
});//end class Snake