/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *  
 * .squareTwo. = gameType
 * .../...\...
 * ..A.....B.. = gameMode
 * ....\./....
 * .....|.....
 * ...Equals.. = gameOperation
 * .....|.....
 * .1,2,3,4,5. = gameDifficulty
 * 
 * Character : kid
 * Theme : (not themed)
 * Concept : player select equivalent dividends for fractions with different divisors
 * Represent fractions as : subdivided rectangles
 *
 * Game modes can be :
 * 
 *   A : equivalence of fractions 
 *       top has more subdivisions
 *   B : equivalence of fractions
 *       bottom has more subdivisions
 * 
 * Operations :
 *
 *   Equals : Player selects equivalent fractions of both blocks 
 * 
 * @namespace
 */
const squareTwo = {

  /**
   * Main code
   */
  create: function () {
    // CONTROL VARIABLES

    this.result = false;    // Check if selected blocks are correct
    this.delay = 0;         // Counter for game dalays
    this.endLevel = false;

    this.A = {
      blocks: [],     // List of selection blocks
      auxBlocks: [],  // List of shadow under selection blocks
      fractions: [],  // Fraction numbers
      selected: 0,    // Number of selected blocks for A
      hasClicked: false,  // Check if player clicked blocks from A
      animate: false,     // Animate blocks from A
      warningText: undefined,
      label: undefined,
    };

    this.B = {
      blocks: [],
      auxBlocks: [],
      fractions: [],
      selected: 0,
      hasClicked: false,
      animate: false,
      warningText: undefined,
      label: undefined,
    };

    // BACKGROUND AND KID
    // Add background image
    game.add.image(0, 0, 'bgimage');
    // Add clouds
    game.add.image(300, 100, 'cloud');
    game.add.image(660, 80, 'cloud');
    game.add.image(110, 85, 'cloud', 0.8);

    // Add floor of grass
    for (let i = 0; i < 9; i++) { game.add.image(i * 100, context.canvas.height - 100, 'floor'); }

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigationIcons.add(
        false, false, false, // Left buttons
        true, false,         // Right buttons
        false, false);
    } else {
      navigationIcons.add(
        true, true, false, // Left buttons
        true, false,       // Right buttons
        'customMenu', false);
    }

    // Add kid
    this.kidAnimation = game.add.sprite(100, context.canvas.height - 128, 'kid_standing', 5, 0.8);
    this.kidAnimation.anchor(0.5, 0.7);

    // Width and Height of A and B
    this.figureWidth = 400;
    const figureHeight = 50;

    // Coordinates for A and B
    let xA, xB, yA, yB;
    if (gameMode != 'B') { // More subdivisions on B
      xA = 230;
      yA = 90;
      xB = xA;
      yB = yA + 3 * figureHeight + 30;
    } else { // More subdivisions on A
      xB = 230;
      yB = 90;
      xA = xB;
      yA = yB + 3 * figureHeight + 30;
    }

    // Possible points for A
    const points = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

    // Random index for 'points'
    const randomIndex = game.math.randomInRange((gameDifficulty - 1) * 2 + 1, (gameDifficulty - 1) * 2 + 3);

    // Number of subdivisions of A and B (blocks)
    const totalBlocksA = points[randomIndex];
    const totalBlocksB = game.math.randomDivisor(totalBlocksA);

    if (debugMode) {
      console.log('Difficulty: ' + gameDifficulty +
        '\ncur index: ' + randomIndex + ', (min index: ' + ((gameDifficulty - 1) * 2 + 1) + ', max index: ' + ((gameDifficulty - 1) * 2 + 3) + ')' +
        '\ntotal blocks A: ' + totalBlocksA + ', total blocks B: ' + totalBlocksB);
    }

    // CREATING TOP FIGURE (A)
    let blockWidth = this.figureWidth / totalBlocksA; // Width of each block in A
    let lineColor = colors.darkRed;
    let fillColor = colors.lightRed;

    // Create blocks
    for (let i = 0; i < totalBlocksA; i++) {
      const x = xA + i * blockWidth;

      // Blocks
      const block = game.add.geom.rect(x, yA, blockWidth, figureHeight, lineColor, 2, fillColor, 0.5);
      block.figure = 'A';
      block.index = i;
      block.finalX = xA;
      this.A.blocks.push(block);

      // Auxiliar blocks
      const alpha = (fractionLabel) ? 0.1 : 0;

      const yAux = yA + figureHeight + 10; // On the bottom of A
      const auxBlock = game.add.geom.rect(x, yAux, blockWidth, figureHeight, lineColor, 1, fillColor, alpha);
      this.A.auxBlocks.push(auxBlock);
    }

    // 'total blocks' label for A : on the side of A
    let xLabel = xA + this.figureWidth + 30;
    let yLabel = yA + figureHeight / 2;

    this.A.label = game.add.text(xLabel, yLabel, this.A.blocks.length, textStyles.h4_blue);

    // 'selected blocks/fraction' label for A : at the bottom of A
    yLabel = yA + figureHeight + 34;

    this.A.fractions[0] = game.add.text(xLabel, yLabel, '', textStyles.h4_blue);
    this.A.fractions[1] = game.add.text(xLabel, yLabel + 21, '', textStyles.h4_blue);
    this.A.fractions[2] = game.add.text(xLabel, yLabel, '___', textStyles.h4_blue);
    this.A.fractions[0].alpha = 0;
    this.A.fractions[1].alpha = 0;
    this.A.fractions[2].alpha = 0;

    // CREATING BOTTOM FIGURE (B)
    blockWidth = this.figureWidth / totalBlocksB; // Width of each block in B
    lineColor = colors.darkGreen;
    fillColor = colors.lightGreen;

    // Blocks and auxiliar blocks
    for (let i = 0; i < totalBlocksB; i++) {
      const x = xB + i * blockWidth;

      // Blocks
      const block = game.add.geom.rect(x, yB, blockWidth, figureHeight, lineColor, 2, fillColor, 0.5);
      block.figure = 'B';
      block.index = i;
      block.finalX = xB;
      this.B.blocks.push(block);

      // Auxiliar blocks
      const alpha = (fractionLabel) ? 0.1 : 0;
      const yAux = yB + figureHeight + 10; // On the bottom of B
      const auxBlock = game.add.geom.rect(x, yAux, blockWidth, figureHeight, lineColor, 1, fillColor, alpha);
      this.B.auxBlocks.push(auxBlock);
    }

    // Label block B
    xLabel = xB + this.figureWidth + 30;
    yLabel = yB + figureHeight / 2;

    this.B.label = game.add.text(xLabel, yLabel, this.B.blocks.length, textStyles.h4_blue);

    // Label fraction
    yLabel = yB + figureHeight + 34;

    this.B.fractions[0] = game.add.text(xLabel, yLabel, '', textStyles.h4_blue);
    this.B.fractions[1] = game.add.text(xLabel, yLabel + 21, '', textStyles.h4_blue);
    this.B.fractions[2] = game.add.text(xLabel, yLabel, '___', textStyles.h4_blue);
    this.B.fractions[0].alpha = 0;
    this.B.fractions[1].alpha = 0;
    this.B.fractions[2].alpha = 0;

    // Invalid selection text
    this.A.warningText = game.add.text(context.canvas.width / 2, context.canvas.height / 2 - 225, '', textStyles.h4_brown);
    this.B.warningText = game.add.text(context.canvas.width / 2, context.canvas.height / 2 - 45, '', textStyles.h4_brown);

    game.timer.start(); // Set a timer for the current level (used in postScore)

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Animate blocks
    if (self.A.animate || self.B.animate) {
      ['A', 'B'].forEach(cur => {
        if (self[cur].animate) {
          // Lower selected blocks
          for (let i = 0; i < self[cur].selected; i++) {
            self[cur].blocks[i].y += 2;
          }

          // After fully lowering blocks, set fraction value
          if (self[cur].blocks[0].y >= self[cur].auxBlocks[0].y) {
            self[cur].fractions[0].name = self[cur].selected;
            self[cur].animate = false;
          }
        }
      });
    }

    // If A and B are already clicked
    if (self.A.hasClicked && self.B.hasClicked && !self.endLevel) {
      game.timer.stop();
      self.delay++;

      // After delay is over, check result
      if (self.delay > 50) {
        self.result = (self.A.selected / self.A.blocks.length) == (self.B.selected / self.B.blocks.length);

        // Fractions are equivalent : CORRECT
        if (self.result) {
          if (audioStatus) game.audio.okSound.play();

          game.add.image(context.canvas.width / 2, context.canvas.height / 2, 'ok').anchor(0.5, 0.5);
          mapMove = true; // Allow character to move to next level in map state
          completedLevels++;

          if (debugMode) console.log('Completed Levels: ' + completedLevels);

          // Fractions are not equivalent : INCORRECT
        } else {
          if (audioStatus) game.audio.errorSound.play();
          game.add.image(context.canvas.width / 2, context.canvas.height / 2, 'error').anchor(0.5, 0.5);
          mapMove = false; // Doesnt allow character to move to next level in map state
        }

        self.postScore();
        self.endLevel = true;

        // Reset delay values for next delay
        self.delay = 0;
      }
    }

    // Wait a bit and go to map state
    if (self.endLevel) {
      self.delay++;

      if (self.delay >= 80) {
        game.state.start('map');
      }
    }

    game.render.all();
  },

  /**
   * Function called by self.onInputOver() when cursor is over a valid rectangle.
   * 
   * @param {object} curBlock rectangle the cursor is over : can be self.A.blocks[i] or self.B.blocks[i]
   */
  overSquare: function (curBlock) {
    const curSet = curBlock.figure; // 'A' || 'B'

    if (!self[curSet].hasClicked) { // self.A.hasClicked || self.B.hasClicked 
      // If over fraction 'n/n' shows warning message not allowing it
      if (curBlock.index == self[curSet].blocks.length - 1) {
        const otherSet = (curSet == 'A') ? 'B' : 'A';

        self[curSet].warningText.name = game.lang.s2_error_msg;
        self[otherSet].warningText.name = '';

        self.outSquare(curSet);
      } else {
        document.body.style.cursor = 'pointer';

        self.A.warningText.name = '';
        self.B.warningText.name = '';

        // Selected blocks become fully visible
        for (let i in self[curSet].blocks) {
          self[curSet].blocks[i].alpha = (i <= curBlock.index) ? 1 : 0.5;
        }

        self[curSet].fractions[0].name = curBlock.index + 1; // Nominator : selected blocks
        self[curSet].fractions[1].name = self[curSet].blocks.length; // Denominator : total blocks

        const newX = curBlock.finalX + ((curBlock.index + 1) * (self.figureWidth / self[curSet].blocks.length)) + 25;
        self[curSet].fractions[0].x = newX;
        self[curSet].fractions[1].x = newX;
        self[curSet].fractions[2].x = newX;

        self[curSet].fractions[0].alpha = 1;
      }
    }
  },

  /**
   * Function called (by self.onInputOver() and self.overSquare()) when cursor is out of a valid rectangle.
   * 
   * @param {object} curSet set of rectangles : can be top (self.A) or bottom (self.B)
   */
  outSquare: function (curSet) {
    if (!self[curSet].hasClicked) {
      self[curSet].fractions[0].alpha = 0;
      self[curSet].fractions[1].alpha = 0;
      self[curSet].fractions[2].alpha = 0;

      self[curSet].blocks.forEach(cur => {
        cur.alpha = 0.5;
      });
    }
  },

  /**
   * Function called by self.onInputDown() when player clicked a valid rectangle.
   * 
   * @param {object} curBlock clicked rectangle : can be self.A.blocks[i] or self.B.blocks[i]
   */
  clickSquare: function (curBlock) {
    const curSet = curBlock.figure; // 'A' || 'B'

    if (!self[curSet].hasClicked && curBlock.index != self[curSet].blocks.length - 1) {
      document.body.style.cursor = 'auto';

      // Turn auxiliar blocks invisible
      for (let i in self[curSet].blocks) {
        if (i > curBlock.index) self[curSet].auxBlocks[i].alpha = 0;
      }

      // Turn value label invisible
      self[curSet].label.alpha = 0;

      if (audioStatus) game.audio.beepSound.play();

      // Save number of selected blocks
      self[curSet].selected = curBlock.index + 1;

      // Set fraction x position
      const newX = curBlock.finalX + (self[curSet].selected * (self.figureWidth / self[curSet].blocks.length)) + 25;
      self[curSet].fractions[0].x = newX;
      self[curSet].fractions[1].x = newX;
      self[curSet].fractions[2].x = newX;

      self[curSet].fractions[1].alpha = 1;
      self[curSet].fractions[2].alpha = 1;

      self[curSet].hasClicked = true; // Inform player have clicked in current block set
      self[curSet].animate = true; // Let it initiate animation
    }

    game.render.all();
  },

  /**
   * Called by mouse click event
   * 
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    // Click block in A
    self.A.blocks.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
    });

    // Click block in B
    self.B.blocks.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
    });

    // Click navigation icons
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

    // Mouse over A : show fraction
    self.A.blocks.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        flagA = true;
        self.overSquare(cur);
      }
    });
    if (!flagA) self.outSquare('A');

    // Mouse over B : show fraction
    self.B.blocks.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        flagB = true;
        self.overSquare(cur);
      }
    });
    if (!flagB) self.outSquare('B');

    if (!flagA && !flagB) document.body.style.cursor = 'auto';

    // Mouse over navigation icons : show name
    navigationIcons.onInputOver(x, y);

    game.render.all();
  },

  /**
   * Saves players data after level ends - to be sent to database. <br>
   *
   * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
   * 
   * @see /php/save.php
   */
  postScore: function () {
    // Creates string that is going to be sent to db
    const data = '&line_game=' + gameShape
      + '&line_mode=' + gameMode
      + '&line_oper=Equal'
      + '&line_leve=' + gameDifficulty
      + '&line_posi=' + mapPosition
      + '&line_resu=' + self.result
      + '&line_time=' + game.timer.elapsed
      + '&line_deta='
      + 'numBlocksA: ' + self.A.blocks.length
      + ', valueA: ' + self.A.selected
      + ', numBlocksB: ' + self.B.blocks.length
      + ', valueB: ' + self.B.selected;

    // FOR MOODLE
    sendToDB(data);
  }

};