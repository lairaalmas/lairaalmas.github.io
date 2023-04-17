/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 * 
 * ..squareOne...	= gameType
 * ..../...\..... 
 * ...A.....B.... = gameMode
 * .....\./......
 * ......|.......
 * ...../.\......
 * .Plus...Minus. = gameOperation
 * .....\./......
 * ......|.......
 * ....1,2,3..... = gameDifficulty
 *
 * Character : tractor
 * Theme : farm
 * Concept : Player associates 'blocks carried by the tractor' and 'floor spaces to be filled by them'
 * Represent fractions as : blocks/rectangles
 *
 * Game modes can be :
 *
 *   A : Player can select # of 'floor blocks' (hole in the ground)
 *       Selects size of hole to be made in the ground (to fill with the blocks in front of the truck)
 *   B : Player can select # of 'stacked blocks' (in front of the truck)
 *       Selects number of blocks in front of the truck (to fill the hole on the ground)
 *
 * Operations can be :
 *
 *   Plus : addition of fractions
 *     Represented by : tractor going to the right (floor positions 0..8)
 *   Minus : subtraction of fractions
 *     Represented by: tractor going to the left (floor positions 8..0)
 *
 * @namespace
 */
const squareOne = {

  /**
   * Main code
   */
  create: function () {
    // CONTROL VARIABLES
    this.checkAnswer = false;   // When true allows game to run 'check answer' code in update
    this.animate = false;       // When true allows game to run 'tractor animation' code in update (turns animation of the moving tractor ON/OFF)
    this.animateEnding = false; // When true allows game to run 'tractor ending animation' code in update (turns 'ending' animation of the moving tractor ON/OFF)
    this.hasClicked = false;    // Checks if player 'clicked' on a block
    this.result = false;        // Checks player 'answer' 
    this.count = 0;             // An 'x' position counter used in the tractor animation        

    this.divisorsList = '';     // Hold the divisors for each fraction on stacked blocks (created for postScore())

    this.direc_level = (gameOperation == 'Minus') ? -1 : 1;    // Will be multiplied to values to easily change tractor direction when needed
    this.animationSpeed = 2 * this.direc_level;   // X distance in which the tractor moves in each iteration of the animation

    // GAME VARIABLES
    this.defaultBlockWidth = 80;   // Base block width
    this.defaultBlockHeight = 40;  // Base block height

    this.startX = (gameOperation == 'Minus') ? 730 : 170; // Initial 'x' coordinate for the tractor and stacked blocks
    this.startY = context.canvas.height - 157;

    // BACKGROUND

    // Add background image
    game.add.image(0, 0, 'bgimage', 2.2);

    // Add clouds
    game.add.image(640, 100, 'cloud');
    game.add.image(1280, 80, 'cloud');
    game.add.image(300, 85, 'cloud', 0.8);

    // Add floor of grass
    for (let i = 0; i < context.canvas.width / 100; i++) { game.add.image(i * 100, context.canvas.height - 100, 'floor'); }

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigationIcons.add(
        false, false, false, // Left icons
        true, false,         // Right icons
        false, false
      );
    } else {
      navigationIcons.add(
        true, true, true,   // Left icons
        true, false,        // Right icons
        'customMenu', this.viewHelp
      );
    }

    // TRACTOR 
    this.tractor = game.add.sprite(this.startX, this.startY, 'tractor', 0, 0.8);

    if (gameOperation == 'Plus') {
      this.tractor.anchor(1, 0.5);
      this.tractor.animation = ['move', [0, 1, 2, 3, 4], 4];
    } else {
      this.tractor.anchor(0, 0.5);
      this.tractor.animation = ['move', [5, 6, 7, 8, 9], 4];
      this.tractor.curFrame = 5;
    }

    // STACKED BLOCKS variables
    this.stck = {
      blocks: [], // Group of 'stacked' block objects
      labels: [], // Group of fraction labels on the side of 'stacked' blocks

      index: undefined, // (gameMode 'B') index of 'stacked' block selected by player

      // Control variables for animation
      curIndex: 0, // (needs to be 0)
      curBlockEnd: undefined,

      // Correct values
      correctIndex: undefined, // (gameMode 'B') index of the CORRECT 'stacked' block
    };

    // FLOOR BLOCKS variables
    this.floor = {
      blocks: [], // Group of 'floor' block objects
      index: undefined, // (gameMode 'A') index of 'floor' block selected by player

      // Control variables for animation
      curIndex: -1, // (needs to be -1)

      // Correct values
      correctIndex: undefined, // (gameMode 'A') index of the CORRECT 'floor' block
      correctX: undefined,  // 'x' coordinate of CORRECT 'floor' block
      correctXA: undefined, // Temporary variable 
      correctXB: undefined, // Temporary variable
    };

    // CREATING STACKED BLOCKS
    this.restart = this.createStckBlocks();

    // CREATING FLOOR BLOCKS
    this.createFloorBlocks();

    // SELECTION ARROW

    if (gameMode == 'A') {
      this.arrow = game.add.image(this.startX + this.defaultBlockWidth * this.direc_level, this.startY + 35, 'arrow_down');
      this.arrow.anchor(0.5, 0.5);
      this.arrow.alpha = 0.5;
    }

    // Help pointer
    this.help = game.add.image(0, 0, 'help_pointer', 0.5);
    this.help.anchor(0.5, 0);
    this.help.alpha = 0;

    if (!this.restart) {
      game.timer.start(); // Set a timer for the current level (used in postScore())
      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);
    }
  },

  /**
   * Game loop
   */
  update: function () {
    // AFTER PLAYER SELECTION

    // Starts tractor moving animation
    if (self.animate) {
      const stck = self.stck;
      const floor = self.floor;

      // MANAGE HORIZONTAL MOVEMENT

      // Move 'tractor'
      self.tractor.x += self.animationSpeed;

      // Move 'stacked blocks'
      for (let i in stck.blocks) {
        stck.blocks[i].x += self.animationSpeed;
      }

      // MANAGE BLOCKS AND FLOOR GAPS
      // If block is 1/n (not 1/1) there's an extra block space to go through before the start of next block
      const restOfCurBlock = (self.defaultBlockWidth - stck.blocks[stck.curIndex].width) * self.direc_level;

      // Check if block falls
      if ((gameOperation == 'Plus' && stck.blocks[0].x >= (stck.curBlockEnd + restOfCurBlock)) ||
        (gameOperation == 'Minus' && stck.blocks[0].x <= (stck.curBlockEnd + restOfCurBlock))) {

        let lowerBlock = true;

        const curEnd = stck.blocks[0].x + stck.blocks[stck.curIndex].width * self.direc_level;

        // If current index is (A) last stacked index (correct index - fixed)
        // If current index is (B) selected stacked index
        if (stck.curIndex == stck.index) {
          // floor.index : (A) selected floor index
          // floor.index : (B) last floor index (correct index - fixed)
          const selectedEnd = floor.blocks[floor.index].x + floor.blocks[0].width * self.direc_level;

          // (A) last stacked block (fixed) doesnt fit selected gap AKA NOT ENOUGH FLOOR BLOCKS (DOESNT CHECK TOO MANY)
          // (B) selected stacked index doesnt fit last floor gap (fixed) AKA TOO MANY STACKED BLOCKS (DOESNT CHECK NOT ENOUGH)
          if ((gameOperation == 'Plus' && curEnd > selectedEnd) || (gameOperation == 'Minus' && curEnd < selectedEnd)) {
            lowerBlock = false;
          }
        } else {
          // Update to next block end
          stck.curBlockEnd += stck.blocks[stck.curIndex + 1].width * self.direc_level;
        }

        // Fill floor gap
        if (lowerBlock) {
          // Until (A) selected floor index
          // Until (B) last floor index (correct index - fixed)
          // Updates floor index to be equivalent to stacked index (and change alpha so floor appears to be filled)
          for (let i = 0; i <= floor.index; i++) {
            if ((gameOperation == 'Plus' && floor.blocks[i].x < curEnd) || (gameOperation == 'Minus' && floor.blocks[i].x > curEnd)) {
              floor.blocks[i].alpha = 0.2;
              floor.curIndex = i;
            }
          }

          // Lower
          stck.blocks[stck.curIndex].alpha = 0;
          stck.blocks.forEach(cur => { cur.y += self.defaultBlockHeight - 2; }); // Lower stacked blocks
        }

        stck.curIndex++;
      }

      // WHEN REACHED END POSITION
      if (stck.curIndex > stck.index || floor.curIndex == floor.index) {
        self.animate = false;
        self.checkAnswer = true;
      }
    }

    // When animation ends check answer
    if (self.checkAnswer) {
      game.timer.stop();

      game.animation.stop(self.tractor.animation[0]);

      if (gameMode == 'A') {
        self.result = self.floor.index == self.floor.correctIndex;
      } else {
        self.result = self.stck.index == self.stck.correctIndex;
      }

      // Give feedback to player and turns on sprite animation
      if (self.result) { // Correct answer
        game.animation.play(self.tractor.animation[0]);

        // Displays feedback image and sound 
        game.add.image(context.canvas.width / 2, context.canvas.height / 2, 'ok').anchor(0.5, 0.5);
        if (audioStatus) game.audio.okSound.play();

        completedLevels++; // Increases number os finished levels
        if (debugMode) console.log('Completed Levels: ' + completedLevels);
      } else { // Incorrect answer
        // Displays feedback image and sound
        game.add.image(context.canvas.width / 2, context.canvas.height / 2, 'error').anchor(0.5, 0.5);
        if (audioStatus) game.audio.errorSound.play();
      }

      self.postScore();

      // AFTER CHECK ANSWER
      self.checkAnswer = false;
      self.animateEnding = true;
    }

    // Starts 'ending' tractor moving animation
    if (self.animateEnding) {
      // ANIMATE ENDING

      self.count++;

      // If CORRECT ANSWER runs final tractor animation (else tractor desn't move, just wait)
      if (self.result) self.tractor.x += self.animationSpeed;

      // WHEN REACHED END POSITION calls map state
      if (self.count >= 140) {
        // If CORRECT ANSWER, player goes to next level in map
        if (self.result) mapMove = true;
        else mapMove = false;

        game.state.start('map');
      }
    }
    game.render.all();
  },

  /**
   * Function called by self.onInputOver() when cursor is over a valid rectangle
   * 
   * @param {object} cur rectangle the cursor is over
   */
  overSquare: function (cur) {
    if (!self.hasClicked) {
      document.body.style.cursor = 'pointer';

      // On gameMode A
      if (gameMode == 'A') {
        for (let i in self.floor.blocks) {
          self.floor.blocks[i].alpha = (i <= cur.index) ? 1 : 0.5;
        }

        // Saves the index of the selected 'floor' block
        self.floor.index = cur.index;

        // On gameMode B
      } else {
        for (let i in self.stck.blocks) {
          self.stck.blocks[i].alpha = (i <= cur.index) ? 0.5 : 0.2;
        }

        // Saves the index of the selected 'stack' block
        self.stck.index = cur.index;
      }
    }
  },

  /**
   * Function called by self.onInputOver() when cursos is out of a valid rectangle
   */
  outSquare: function () {
    if (!self.hasClicked) {
      document.body.style.cursor = 'auto';

      // On game mode A
      if (gameMode == 'A') {
        for (let i in self.floor.blocks) {
          self.floor.blocks[i].alpha = 0.5; // Back to normal
        }

        self.floor.index = -1;
        // On game mode B
      } else {
        for (let i in self.stck.blocks) {
          self.stck.blocks[i].alpha = 0.5; // Back to normal
        }

        self.stck.index = -1;
      }
    }
  },

  /**
   * Function called by self.onInputDown() when player clicks on a valid rectangle.
   */
  clickSquare: function () {
    if (!self.hasClicked && !self.animateEnding) {
      document.body.style.cursor = 'auto';

      // On gameMode A
      if (gameMode == 'A') {
        // Turns selection arrow completely visible
        self.arrow.alpha = 1;

        // Make the unselected blocks invisible (look like there's only the ground)
        for (let i in self.floor.blocks) {
          // (SELECTION : self.FLOOR.index)
          if (i > self.floor.index) self.floor.blocks[i].alpha = 0; // Make unselected 'floor' blocks invisible
        }

        // (FIXED : self.STCK.index) save the 'stacked' blocks index
        self.stck.index = self.stck.blocks.length - 1;
        // On gameMode B
      } else {
        for (let i in self.stck.blocks) {
          // (FIXED : self.STCK.index)
          if (i > self.stck.index) self.stck.blocks[i].alpha = 0; // Make unselected 'stacked' blocks invisible
        }

        // (SELECTION : self.FLOOR.index) save the 'floor' blocks index to compare to the stacked index in update
        self.floor.index = self.floor.blocks.length - 1;

        // Save the updated total stacked blocks to compare in update
        self.stck.blocks.length = self.stck.index + 1;
      }

      // Play beep sound
      if (audioStatus) game.audio.beepSound.play();

      // Hide labels
      if (fractionLabel) {
        self.stck.labels.forEach(cur => {
          cur.forEach(cur => { cur.alpha = 0; });
        });
      }
      // Hide solution pointer
      if (self.help != undefined) self.help.alpha = 0;

      // Turn tractir animation on
      game.animation.play(self.tractor.animation[0]);

      self.hasClicked = true;
      self.animate = true;
    }
  },

  /**
   * Create stacked blocks for the level in create()
   * 
   * @returns {boolean}
   */
  createStckBlocks: function () {
    let hasBaseDifficulty = false; // Will be true after next for loop if level has at least one '1/difficulty' fraction (if false, restart)
    const max = (gameMode == 'B') ? 10 : mapPosition + 4; // Maximum number of stacked blocks for the level

    const total = game.math.randomInRange(mapPosition + 2, max); // Current number of stacked blocks for the level

    self.floor.correctXA = self.startX + self.defaultBlockWidth * self.direc_level;

    for (let i = 0; i < total; i++) { // For each stacked block
      let divisor = game.math.randomInRange(1, gameDifficulty); // Set divisor for fraction
      if (divisor == gameDifficulty) hasBaseDifficulty = true;
      if (divisor == 3) divisor = 4; // Make sure valid divisors are 1, 2 and 4 (not 3)
      self.divisorsList += divisor + ','; // List of divisors (for postScore())

      const curBlockWidth = self.defaultBlockWidth / divisor; // Current width is a fraction of the default

      self.floor.correctXA += curBlockWidth * self.direc_level;

      // Create stacked block (close to tractor)
      const lineColor = (gameOperation == 'Minus') ? colors.red : colors.darkBlue;
      const lineSize = 2;
      const block = game.add.geom.rect(
        self.startX,
        self.startY + 17 - i * (self.defaultBlockHeight - lineSize),
        curBlockWidth - lineSize,
        self.defaultBlockHeight - lineSize,
        lineColor,
        lineSize,
        colors.white,
        1);
      const anchor = (gameOperation == 'Minus') ? 1 : 0;
      block.anchor(anchor, 0);

      // If game is type B, adding events to stacked blocks
      if (gameMode == 'B') {
        block.alpha = 0.5;
        block.index = i;
      }

      self.stck.blocks.push(block);

      // If 'show fractions' is turned on, create labels that display the fractions on the side of each block
      if (fractionLabel) {
        const x = self.startX + (curBlockWidth + 15) * self.direc_level;
        const y = self.defaultBlockHeight - lineSize;

        const label = [];

        if (divisor == 1) {
          label[0] = game.add.text(x, self.startY + 43 - i * y, divisor, textStyles.h2_blue);
        } else {
          label[0] = game.add.text(x, self.startY + 34 - i * y + 16, divisor, textStyles.p_blue);
          label[1] = game.add.text(x, self.startY + 34 - i * y, '1', textStyles.p_blue);
          label[2] = game.add.text(x, self.startY + 39 - i * y, '_', textStyles.p_blue);
        }
        // Add current label to group of labels
        self.stck.labels.push(label);
      }
    }

    // Will be used as a counter in update, adding in the width of each stacked block to check if the end matches the floor selected position
    self.stck.curBlockEnd = self.startX + self.stck.blocks[0].width * self.direc_level;

    let restart = false;

    // Check for errors (level too easy for its difficulty or end position out of bounds)
    if (!hasBaseDifficulty ||
      (gameOperation == 'Plus' && (self.floor.correctXA < (self.startX + self.defaultBlockWidth) ||
        self.floor.correctXA > (self.startX + 8 * self.defaultBlockWidth))) ||
      (gameOperation == 'Minus' && (self.floor.correctXA < (self.startX - (8 * self.defaultBlockWidth)) ||
        self.floor.correctXA > (self.startX - self.defaultBlockWidth)))
    ) {
      restart = true; // If any error is found restart the level
    }

    if (debugMode) console.log('Stacked blocks: ' + total + ' (min: ' + (mapPosition + 2) + ', max: ' + max + ')');

    return restart;
  },

  /**
   * Create floor blocks for the level in create()
   */
  createFloorBlocks: function () { // For each floor block
    const divisor = (gameDifficulty == 3) ? 4 : gameDifficulty; // Make sure valid divisors are 1, 2 and 4 (not 3)

    let total = 8 * divisor; // Number of floor blocks

    const blockWidth = self.defaultBlockWidth / divisor; // Width of each floor block

    // If game is type B, selectiong a random floor x position
    if (gameMode == 'B') {
      self.stck.correctIndex = game.math.randomInRange(0, (self.stck.blocks.length - 1)); // Correct stacked index

      self.floor.correctXB = self.startX + self.defaultBlockWidth * self.direc_level;

      for (let i = 0; i <= self.stck.correctIndex; i++) {
        self.floor.correctXB += self.stck.blocks[i].width * self.direc_level; // Equivalent x position on the floor
      }
    }

    let flag = true;

    for (let i = 0; i < total; i++) { // For each floor block
      // 'x' coordinate for floor block
      const x = self.startX + (self.defaultBlockWidth + i * blockWidth) * self.direc_level;

      if (flag && gameMode == 'A') {
        if ((gameOperation == 'Plus' && x >= self.floor.correctXA) || (gameOperation == 'Minus' && x <= self.floor.correctXA)) {
          self.floor.correctIndex = i - 1; // Set index of correct floor block
          flag = false;
        }
      }

      if (gameMode == 'B') {
        if ((gameOperation == 'Plus' && x >= self.floor.correctXB) || (gameOperation == 'Minus' && x <= self.floor.correctXB)) {
          total = i;
          break;
        }
      }

      // Create floor block
      const lineSize = 0.9;
      const block = game.add.geom.rect(
        x,
        self.startY + 17 + self.defaultBlockHeight - lineSize,
        blockWidth - lineSize,
        self.defaultBlockHeight - lineSize,
        colors.blueBckg,
        lineSize,
        colors.blueBckgInsideLevel,
        1);
      const anchor = (gameOperation == 'Minus') ? 1 : 0;
      block.anchor(anchor, 0);

      // If game is type A, adding events to floor blocks
      if (gameMode == 'A') {
        block.alpha = 0.5;
        block.index = i;
      }

      // Add current label to group of labels
      self.floor.blocks.push(block);
    }

    if (gameMode == 'A') self.floor.correctX = self.floor.correctXA;
    else if (gameMode == 'B') self.floor.correctX = self.floor.correctXB;

    // Creates labels on the floor to display the numbers
    for (let i = 1; i < 10; i++) {
      const x = self.startX + (i * self.defaultBlockWidth * self.direc_level);
      game.add.text(x, self.startY + self.defaultBlockHeight + 78, i - 1, textStyles.h2_blue);
    }
  },

  /**
   * Display correct answer
   */
  viewHelp: function () {
    if (!self.hasClicked) {
      // On gameMode A
      if (gameMode == 'A') {
        const aux = self.floor.blocks[0];
        self.help.x = self.floor.correctX - aux.width / 2 * self.direc_level;
        self.help.y = 501;
        // On gameMode B
      } else {
        const aux = self.stck.blocks[self.stck.correctIndex];
        self.help.x = aux.x + aux.width / 2 * self.direc_level;
        self.help.y = aux.y;
      }

      self.help.alpha = 0.7;
    }
  },

  /**
   * Called by mouse click event
   * 
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    if (gameMode == 'A') {
      self.floor.blocks.forEach(cur => {
        if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
      });
    } else {
      self.stck.blocks.forEach(cur => {
        if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
      });
    }

    navigationIcons.onInputDown(x, y);

    game.render.all();
  },

  /**
   * Called by mouse move event
   * 
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let flagA = false;
    let flagB = false;

    if (gameMode == 'A') {
      // Make arrow follow mouse
      if (!self.hasClicked && !self.animateEnding) {
        if (game.math.distanceToPointer(self.arrow.x, x, self.arrow.y, y) > 8) {
          self.arrow.x = (x < 250) ? 250 : x; // Limits the arrow left position to 250
        }
      }

      self.floor.blocks.forEach(cur => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagA = true;
          self.overSquare(cur);
        }
      });

      if (!flagA) self.outSquare('A');
    }

    if (gameMode == 'B') {
      self.stck.blocks.forEach(cur => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagB = true;
          self.overSquare(cur);
        }
      });

      if (!flagB) self.outSquare('B');
    }

    navigationIcons.onInputOver(x, y);

    game.render.all();
  },

  /**
   * Saves players data after level ends - to be sent to database <br>
   *
   * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
   * 
   * @see /php/save.php
   */
  postScore: function () {
    // Creates string that is going to be sent to db
    const data = '&line_game=' + gameShape
      + '&line_mode=' + gameMode
      + '&line_oper=' + gameOperation
      + '&line_leve=' + gameDifficulty
      + '&line_posi=' + mapPosition
      + '&line_resu=' + self.result
      + '&line_time=' + game.timer.elapsed
      + '&line_deta='
      + 'numBlocks:' + self.stck.blocks.length
      + ', valBlocks: ' + self.divisorsList // Ends in ','
      + ' blockIndex: ' + self.stck.index
      + ', floorIndex: ' + self.floor.index;

    // FOR MOODLE  
    sendToDB(data);
  }

};