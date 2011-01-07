Snake
=====

A simple version plugin of snake game based on MooTools framework.

![Screenshot](http://farm6.static.flickr.com/5082/5330357247_f6f2fdd892.jpg)

How to use
----------

First you must to include the JS files in the head of your HTML document:

            #HTML
            <script type="text/javascript" src="mootools-core.js"></script>
            <script type="text/javascript" src="snake.js"></script>

In your JS:
          
           #JS
           window.addEvent('domready',function(){
                  new Snake({divId:'snake', 
                             width:15, 
                             height:15, 
                             scoreId: 'score', 
                             timeId:'time', 
                             highScoreId:'high-score', 
                             resetId:'reset-high-score', 
                             speedPrefixId: 'speed-'
                             });
           });  

In your HTML body:

           #HTML
           <div id="container">
               <div id="stats">
                    <p id="score-p" class="stat"><span class="stat-title">Score: </span><span id="score">0</span></p>
                    <p id="time-p" class="stat"><span class="stat-title">Time: </span><span id="time"></span></p>
              </div>
              <div id="snake"></div>
              <p id="high-score-p">Your high score <span id="high-score"></span> <a href="#" id="reset-high-score">reset</a></p> 
              <div id="logger"></div>
           </div>

In your HEAD document:

           #css  
           <link rel="stylesheet" type="text/css" href="snake.css" />

