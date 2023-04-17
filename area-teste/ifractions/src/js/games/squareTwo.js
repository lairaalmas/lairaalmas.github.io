/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *
 * .squareTwo. = gameName
 * .../...\...
 * ..a.....b.. = gameMode
 * ....\./....
 * .....|.....
 * ..equals... = gameOperation
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
 *   a : equivalence of fractions
 *       top has more subdivisions
 *   b : equivalence of fractions
 *       bottom has more subdivisions
 *
 * Operations :
 *
 *   equals : Player selects equivalent fractions of both blocks
 *
 * @namespace
 */
const squareTwo = {
  ui: undefined,
  control: undefined,

  blocks: undefined,

  /**
   * Main code
   */
  create: function () {
    this.ui = {
      message: undefined,
      continue: {
        // modal: undefined,
        button: undefined,
        text: undefined,
      },
    };
    this.control = {
      blockWidth: 600,
      blockHeight: 75,
      isCorrect: false,
      showEndInfo: false,
      animationDelay: 0,
      startDelay: false,
      startEndAnimation: false,
    };
    this.blocks = {
      top: {
        list: [], // List of block objects
        auxBlocks: [], // List of shadow under selection blocks
        fractions: [], // Fractions
        selectedAmount: 0,
        hasClicked: false, // Check if player clicked blocks from (a)
        animate: false, // Animate blocks from (a)
        warningText: undefined,
        label: undefined,
      },
      bottom: {
        list: [],
        auxBlocks: [],
        fractions: [],
        selectedAmount: 0,
        hasClicked: false,
        animate: false,
        warningText: undefined,
        label: undefined,
      },
    };

    renderBackground();

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigation.add.right(['audio']);
    } else {
      navigation.add.left(['back', 'menu'], 'customMenu');
      navigation.add.right(['audio']);
    }

    // Add kid
    this.utils.renderCharacters();
    this.utils.renderBlockSetup();
    this.utils.renderMainUI();

    game.timer.start(); // Set a timer for the current level (used in postScore)
    game.event.add('click', this.events.onInputDown);
    game.event.add('mousemove', this.events.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Animate blocks
    if (self.blocks.top.animate || self.blocks.bottom.animate) {
      self.utils.moveBlocks();
    }

    // If (a) and (b) are already clicked
    if (
      !self.control.startDelay &&
      !self.control.startEndAnimation &&
      self.blocks.top.hasClicked &&
      self.blocks.bottom.hasClicked
    ) {
      self.control.startDelay = true;
    }

    if (self.control.startDelay && !self.control.startEndAnimation) {
      self.utils.startDelayHandler();
    }

    // Wait a bit and go to map state
    if (self.control.startEndAnimation) {
      self.utils.runEndAnimation();
    }

    game.render.all();
  },

  utils: {
    startDelayHandler: () => {
      console.log('startdelayhandler');
      self.control.animationDelay++;

      if (self.control.animationDelay === 50) {
        self.utils.checkAnswer();
        self.control.animationDelay = 0;
        self.control.startEndAnimation = true;
      }
    },
    // RENDERS
    renderBlockSetup: function () {
      // Coordinates for (a) and (b)
      let xA, xB, yA, yB;

      if (gameMode != 'b') {
        // Has more subdivisions on (b)
        xA = context.canvas.width / 2 - self.control.blockWidth / 2;
        yA = getFrameInfo().y + 100;
        xB = xA;
        yB = yA + 3 * self.control.blockHeight + 30;
      } else {
        // Has more subdivisions on (a)
        xB = context.canvas.width / 2 - self.control.blockWidth / 2;
        yB = getFrameInfo().y + 100;
        xA = xB;
        yA = yB + 3 * self.control.blockHeight + 30;
      }

      // Possible points for (a)
      const points = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

      // Random index for 'points'
      const randomIndex = game.math.randomInRange(
        (gameDifficulty - 1) * 2 + 1,
        (gameDifficulty - 1) * 2 + 3
      );

      // Number of subdivisions of (a) and (b) (blocks)
      const totalBlocksA = points[randomIndex];
      const totalBlocksB = game.math.randomDivisor(totalBlocksA);

      const blockWidthA = self.control.blockWidth / totalBlocksA;
      const blockWidthB = self.control.blockWidth / totalBlocksB;

      if (isDebugMode) {
        console.log(
          `Difficulty: ${gameDifficulty}\ncur index: ${randomIndex}, (min index: ${
            (gameDifficulty - 1) * 2 + 1
          }, max index: ${
            (gameDifficulty - 1) * 2 + 3
          })\ntotal blocks a: ${totalBlocksA}, total blocks b: ${totalBlocksB}`
        );
      }

      // (a)
      self.utils.renderBlocks(
        self.blocks.top,
        'top',
        totalBlocksA,
        blockWidthA,
        colors.blueDark,
        colors.blueLight,
        xA,
        yA
      );

      // (b)
      self.utils.renderBlocks(
        self.blocks.bottom,
        'bottom',
        totalBlocksB,
        blockWidthB,
        colors.greenDark,
        colors.greenLight,
        xB,
        yB
      );
    },
    renderBlocks: function (
      blocks,
      blockType,
      totalBlocks,
      blockWidth,
      lineColor,
      fillColor,
      x0,
      y0
    ) {
      for (let i = 0; i < totalBlocks; i++) {
        // Blocks
        const curX = x0 + i * blockWidth;
        const curBlock = game.add.geom.rect(
          curX,
          y0,
          blockWidth,
          self.control.blockHeight,
          fillColor,
          0.5,
          lineColor,
          4
        );
        curBlock.position = blockType;
        curBlock.index = i;
        curBlock.finalX = x0;
        blocks.list.push(curBlock);

        // Auxiliar blocks (lower alpha)
        const alpha = showFractions ? 0.2 : 0;
        const curYAux = y0 + self.control.blockHeight + 10;
        const curAuxBlock = game.add.geom.rect(
          curX,
          curYAux,
          blockWidth,
          self.control.blockHeight,
          fillColor,
          alpha,
          lineColor,
          1
        );
        blocks.auxBlocks.push(curAuxBlock);
      }

      // Label - number of blocks (on the right)
      let yLabel = y0 + self.control.blockHeight / 2 + 10;
      const xLabel = x0 + self.control.blockWidth + 35;
      const font = {
        ...textStyles.h4_,
        font: 'bold ' + textStyles.h4_.font,
        fill: lineColor,
      };

      blocks.label = game.add.text(xLabel, yLabel, blocks.list.length, font);

      // 'selected blocks/fraction' label for (a) : at the bottom of (a)
      yLabel = y0 + self.control.blockHeight + 40;

      blocks.fractions[0] = game.add.text(xLabel, yLabel, '', font);
      blocks.fractions[1] = game.add.text(xLabel, yLabel + 40, '', font);
      blocks.fractions[2] = game.add.text(xLabel, yLabel + 2, '___', font);
      blocks.fractions[0].alpha = 0;
      blocks.fractions[1].alpha = 0;
      blocks.fractions[2].alpha = 0;

      // Invalid selection text
      blocks.warningText = game.add.text(
        context.canvas.width / 2,
        y0 - 20,
        game.lang.s2_error_msg,
        { ...font, font: textStyles.h4_.font }
      );
      blocks.warningText.alpha = 0;
    },
    renderCharacters: function () {
      self.kidAnimation = game.add.sprite(
        100,
        context.canvas.height - 128 * 1.5,
        'kid_standing',
        0,
        1.2
      );
      self.kidAnimation.anchor(0.5, 0.7);
      self.kidAnimation.curFrame = 3;
    },
    renderMainUI: () => {
      // Intro text
      const treatedMessage = game.lang.squareTwo_intro.split('\\n');
      const font = textStyles.h1_;
      self.ui.message = [];
      self.ui.message.push(
        game.add.text(context.canvas.width / 2, 170, treatedMessage[0], font)
      );
      self.ui.message.push(
        game.add.text(context.canvas.width / 2, 220, treatedMessage[1], font)
      );
    },
    renderOperationUI: () => {
      const uiList = [
        ...self.blocks.top.list,
        ...self.blocks.bottom.list,
        ...self.blocks.top.fractions,
        ...self.blocks.bottom.fractions,
      ];
      moveList(uiList, -400, 0);

      const font = textStyles.fraction;
      font.fill = colors.black;
      font.align = 'center';

      const nominators = [
        self.blocks.top.selectedAmount,
        self.blocks.bottom.selectedAmount,
      ];
      const denominators = [
        self.blocks.top.list.length,
        self.blocks.bottom.list.length,
      ];
      const renderList = [];

      const padding = 100;
      const offsetX = 100;

      const cardHeight = 400;

      const x0 = padding + 400;
      const y0 = context.canvas.height / 2;
      let nextX = x0;

      const cardX = x0 - padding;
      const cardY = y0;

      // Card
      const card = game.add.geom.rect(
        cardX,
        cardY,
        0,
        cardHeight,
        colors.blueLight,
        0.5,
        colors.blueDark,
        8
      );
      card.id = 'card';
      card.anchor(0, 0.5);
      renderList.push(card);

      renderList.push(game.add.text(nextX, y0, nominators[0], font));
      renderList.push(game.add.text(nextX, y0 + 70, denominators[0], font));
      renderList.push(game.add.text(nextX, y0, '___', font));

      font.fill = self.control.isCorrect ? colors.green : colors.red;
      nextX += offsetX;
      renderList.push(
        game.add.text(nextX, y0 + 35, self.control.isCorrect ? '=' : '≠', font)
      );

      font.fill = colors.black;
      nextX += offsetX;
      renderList.push(game.add.text(nextX, y0, nominators[1], font));
      renderList.push(game.add.text(nextX, y0 + 70, denominators[1], font));
      renderList.push(game.add.text(nextX, y0, '___', font));

      //let resultWidth = ''.length * widthOfChar;
      const cardWidth = nextX - x0 + padding * 2;
      card.width = cardWidth;

      const endSignX =
        (context.canvas.width - cardWidth) / 2 + cardWidth + 400 + 50;

      // Center Card
      moveList(renderList, (context.canvas.width - cardWidth) / 2, 0);

      self.fractionOperationUI = renderList;

      return endSignX;
    },
    renderEndUI: () => {
      let btnColor = colors.green;
      let btnText = game.lang.continue;

      if (!self.control.isCorrect) {
        btnColor = colors.red;
        btnText = game.lang.retry;
      }

      // continue button
      self.ui.continue.button = game.add.geom.rect(
        context.canvas.width / 2 + 400,
        context.canvas.height / 2 + 280,
        450,
        100,
        btnColor
      );
      self.ui.continue.button.anchor(0.5, 0.5);
      self.ui.continue.text = game.add.text(
        context.canvas.width / 2 + 400,
        context.canvas.height / 2 + 16 + 280,
        btnText,
        textStyles.btn
      );
    },

    // UPDATE
    moveBlocks: function () {
      ['top', 'bottom'].forEach((cur) => {
        if (self.blocks[cur].animate) {
          // Lower selected blocks
          for (let i = 0; i < self.blocks[cur].selectedAmount; i++) {
            self.blocks[cur].list[i].y += 2;
          }

          // After fully lowering blocks, set fraction value
          if (self.blocks[cur].list[0].y >= self.blocks[cur].auxBlocks[0].y) {
            self.blocks[cur].fractions[0].name =
              self.blocks[cur].selectedAmount;
            self.blocks[cur].animate = false;
          }
        }
      });
    },
    checkAnswer: function () {
      for (let block of self.blocks.top.auxBlocks) {
        block.alpha = 0;
      }
      for (let block of self.blocks.bottom.auxBlocks) {
        block.alpha = 0;
      }

      // After delay is over, check result
      //if (self.control.animationDelay > 50) {
      self.control.isCorrect =
        self.blocks.top.selectedAmount / self.blocks.top.list.length ==
        self.blocks.bottom.selectedAmount / self.blocks.bottom.list.length;

      const x = self.utils.renderOperationUI();

      if (self.control.isCorrect) {
        if (audioStatus) game.audio.okSound.play();
        game.add
          .image(x + 50, context.canvas.height / 2, 'answer_correct')
          .anchor(0.5, 0.5);
        completedLevels++;
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        if (audioStatus) game.audio.errorSound.play();
        game.add
          .image(x, context.canvas.height / 2, 'answer_wrong')
          .anchor(0.5, 0.5);
      }

      self.fetch.postScore();
    },
    runEndAnimation: function () {
      self.control.animationDelay++;

      if (self.control.animationDelay === 100) {
        self.utils.renderEndUI();
        self.control.showEndInfo = true;

        if (self.control.isCorrect) canGoToNextMapPosition = true;
        else canGoToNextMapPosition = false;
      }
    },
    endLevel: function () {
      game.state.start('map');
    },

    // HANDLERS
    /**
     * Function called by self.onInputDown() when player clicked a valid rectangle.
     *
     * @param {object} curBlock clicked rectangle : can be self.blocks.top.list[i] or self.blocks.bottom.list[i]
     */
    clickSquareHandler: function (curBlock) {
      const curSet = curBlock.position;

      if (
        !self.blocks[curSet].hasClicked &&
        curBlock.index != self.blocks[curSet].list.length - 1
      ) {
        document.body.style.cursor = 'auto';

        // Turn auxiliar blocks invisible
        for (let i in self.blocks[curSet].list) {
          if (i > curBlock.index) self.blocks[curSet].auxBlocks[i].alpha = 0;
        }

        // Turn value label invisible
        self.blocks[curSet].label.alpha = 0;

        if (audioStatus) game.audio.popSound.play();

        // Save number of selected blocks
        self.blocks[curSet].selectedAmount = curBlock.index + 1;

        // Set fraction x position
        const newX =
          curBlock.finalX +
          self.blocks[curSet].selectedAmount *
            (self.control.blockWidth / self.blocks[curSet].list.length) +
          40;

        self.blocks[curSet].fractions[0].x = newX;
        self.blocks[curSet].fractions[1].x = newX;
        self.blocks[curSet].fractions[2].x = newX;

        self.blocks[curSet].fractions[1].alpha = 1;
        self.blocks[curSet].fractions[2].alpha = 1;

        self.blocks[curSet].hasClicked = true; // Inform player have clicked in current block set
        self.blocks[curSet].animate = true; // Let it initiate animation
      }

      game.render.all();
    },
    /**
     * Function called by self.onInputOver() when cursor is over a valid rectangle.
     *
     * @param {object} curBlock rectangle the cursor is over : can be self.blocks.top.list[i] or self.blocks.bottom.list[i]
     */
    overSquareHandler: function (curBlock) {
      const curSet = curBlock.position;

      if (!self.blocks[curSet].hasClicked) {
        // self.blocks.top.hasClicked || self.blocks.bottom.hasClicked
        // If over fraction 'n/n' shows warning message not allowing it
        if (curBlock.index == self.blocks[curSet].list.length - 1) {
          const otherSet = curSet == 'top' ? 'bottom' : 'top';

          self.blocks[curSet].warningText.alpha = 1;
          self.blocks[otherSet].warningText.alpha = 0;

          self.utils.outSquareHandler(curSet);
        } else {
          document.body.style.cursor = 'pointer';

          self.blocks.top.warningText.alpha = 0;
          self.blocks.bottom.warningText.alpha = 0;

          // Selected blocks become fully visible
          for (let i in self.blocks[curSet].list) {
            self.blocks[curSet].list[i].alpha = i <= curBlock.index ? 1 : 0.5;
          }

          self.blocks[curSet].fractions[0].name = curBlock.index + 1; // Nominator : selected blocks
          self.blocks[curSet].fractions[1].name =
            self.blocks[curSet].list.length; // Denominator : total blocks

          const newX =
            curBlock.finalX +
            (curBlock.index + 1) *
              (self.control.blockWidth / self.blocks[curSet].list.length) +
            25;
          self.blocks[curSet].fractions[0].x = newX;
          self.blocks[curSet].fractions[1].x = newX;
          self.blocks[curSet].fractions[2].x = newX;

          self.blocks[curSet].fractions[0].alpha = 1;
        }
      }
    },
    /**
     * Function called (by self.onInputOver() and self.utils.overSquareHandler()) when cursor is out of a valid rectangle.
     *
     * @param {object} curSet set of rectangles : can be top (self.blocks.top) or bottom (self.blocks.bottom)
     */
    outSquareHandler: function (curSet) {
      if (!self.blocks[curSet].hasClicked) {
        self.blocks[curSet].fractions[0].alpha = 0;
        self.blocks[curSet].fractions[1].alpha = 0;
        self.blocks[curSet].fractions[2].alpha = 0;

        self.blocks[curSet].list.forEach((cur) => {
          cur.alpha = 0.5;
        });
      }
    },
  },
  events: {
    /**
     * Called by mouse click event
     *
     * @param {object} mouseEvent contains the mouse click coordinates
     */
    onInputDown: function (mouseEvent) {
      const x = game.math.getMouse(mouseEvent).x;
      const y = game.math.getMouse(mouseEvent).y;

      // Click block in (a)
      self.blocks.top.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Click block in (b)
      self.blocks.bottom.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          self.utils.endLevel();
        }
      }

      // Click navigation icons
      navigation.onInputDown(x, y);

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

      // Mouse over (a) : show fraction
      self.blocks.top.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagA = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagA) self.utils.outSquareHandler('top');

      // Mouse over (b) : show fraction
      self.blocks.bottom.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagB = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagB) self.utils.outSquareHandler('bottom');

      if (!flagA && !flagB) document.body.style.cursor = 'auto';

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          // If pointer is over icon
          document.body.style.cursor = 'pointer';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1.1;
          self.ui.continue.text.style = textStyles.btnLg;
        } else {
          // If pointer is not over icon
          document.body.style.cursor = 'auto';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1;
          self.ui.continue.text.style = textStyles.btn;
        }
      }

      // Mouse over navigation icons : show name
      navigation.onInputOver(x, y);

      game.render.all();
    },
  },
  fetch: {
    /**
     * Saves players data after level ends - to be sent to database. <br>
     *
     * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
     *
     * @see /php/save.php
     */
    postScore: function () {
      // Creates string that is going to be sent to db
      const data =
        '&line_game=' +
        gameShape +
        '&line_mode=' +
        gameMode +
        '&line_oper=Equal' +
        '&line_leve=' +
        gameDifficulty +
        '&line_posi=' +
        curMapPosition +
        '&line_resu=' +
        self.control.isCorrect +
        '&line_time=' +
        game.timer.elapsed +
        '&line_deta=' +
        'numBlocksA: ' +
        self.blocks.top.list.length +
        ', valueA: ' +
        self.blocks.top.selectedAmount +
        ', numBlocksB: ' +
        self.blocks.bottom.list.length +
        ', valueB: ' +
        self.blocks.bottom.selectedAmount;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
