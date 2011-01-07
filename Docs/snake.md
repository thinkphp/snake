Class: Snake (#Snake)
========================================================

A simple plugin of Snake game based on MooTools framework.


Snake Method: constructor(#Snake: constructor)
--------------------------------------------------------------------------------

### Syntax: 

new Snake(options);
 
#### Arguments:
  
- options

#### options:

- divId         (*String* default 'snake')                - id of the div where to insert snake board.
- width         (*Integer* default to 15)                 - width of game board (in snake segments units).
- height        (*Integer* default to 15)                 - height of game board (in snake segments units).
- scoreId       (*String* default to 'score')             - id of the element to insert score into (tipically a span)
- timeId        (*String* default to 'time')              - id of the element to insert time into (tipically a span)
- highScoreId   (*String* default to 'high-score')        - id of the element to insert highscore.
- resetId       (*String* default to 'reset-high-score')  - id of the element reset button. 
- speedPrefixId (*String* default to 'prefix-')           - prefix to the IDs to append '-slow', '-medium', '-fast' for speed button links.

### Returns:

A Snake instance.