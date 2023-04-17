/******************************
 * This file holds game states.
 ******************************/

/** [MAP STATE] Screen that shows the 4 generated levels in a map (and the level where the player is currently in).
 *
 * @namespace
 */
const mapState = {
  /**
   * Main code
   */
  create: function () {
    const x0 = 306;
    const y0 = 161;
    this.waitUserAction = false;
    this.scene = {
      rocks: {
        x: [x0 + 172, x0 + 604, x0 + 353],
        y: [y0 + 319, y0 + 88, y0 + 667, ,],
      },
      bushes: {
        x: [x0 + 344, x0 + 822, x0 + 1006, x0 + 613],
        y: [y0 + 224, y0 + 43, y0 + 310, y0 + 464],
      },
      trees: {
        x: [
          x0 + 26,
          x0 + 776,
          x0 + 401,
          x0 + 1006,
          x0 + 204,
          x0 + 1065,
          x0 + 435,
          x0 + 728,
        ],
        y: [
          y0 + 174,
          y0 + 250,
          y0 - 67,
          y0 + 417,
          y0 + 16,
          y0 + 116,
          y0 + 435,
          y0 + 511,
        ],
        type: [2, 2, 3, 4, 4, 4, 4, 1],
      },
      roadPoints: {
        x: [x0 + 78, x0 + 251, x0 + 424, x0 + 598, x0 + 770, x0 + 943],
        y: [y0 + 629, y0 + 536, y0 + 443, y0 + 347, y0 + 252, y0 + 159],
      },
    };

    renderBackground('plain');

    // Map
    game.add.image(x0, y0, 'bg_map', 1.5);

    // Buildings
    gameList[gameId].assets.map.startBuilding();
    gameList[gameId].assets.map.endBuilding();

    // Rocks
    for (let i in this.scene.rocks.x) {
      game.add.image(
        this.scene.rocks.x[i],
        this.scene.rocks.y[i],
        'rock',
        0.48
      );
    }

    // Bushes
    for (let i in this.scene.bushes.x) {
      game.add.image(
        this.scene.bushes.x[i],
        this.scene.bushes.y[i],
        'bush',
        0.59
      );
    }

    // Trees
    for (let i in this.scene.trees.x) {
      game.add.image(
        this.scene.trees.x[i],
        this.scene.trees.y[i],
        'tree_' + this.scene.trees.type[i],
        0.9
      );
    }

    //Road points
    for (let i = 1; i < this.scene.roadPoints.x.length - 1; i++) {
      const frame =
        i < curMapPosition || (canGoToNextMapPosition && i == curMapPosition)
          ? 1
          : 0;
      // Road points (game levels)
      game.add.sprite(
        this.scene.roadPoints.x[i],
        this.scene.roadPoints.y[i],
        'map_place',
        frame,
        0.45
      );
      // Road signs
      game.add.image(
        this.scene.roadPoints.x[i] - 40,
        this.scene.roadPoints.y[i] - 154,
        'sign',
        0.7
      );
      game.add.text(
        this.scene.roadPoints.x[i],
        this.scene.roadPoints.y[i] - 104,
        i,
        {
          ...textStyles.h2_,
          fill: colors.white,
        }
      );
    }

    // Character
    this.character = gameList[gameId].assets.map.character(gameOperation);

    // Character animation
    this.character.animation =
      gameList[gameId].assets.map.characterAnimation(gameOperation);

    game.animation.play(this.character.animation[0]);

    this.moveCounter = 0;

    const speed = 60;
    const xA = this.scene.roadPoints.x[curMapPosition];
    const yA = this.scene.roadPoints.y[curMapPosition];
    const xB = this.scene.roadPoints.x[curMapPosition + 1];
    const yB = this.scene.roadPoints.y[curMapPosition + 1];
    self.speedX = (xB - xA) / speed;
    self.speedY = (yA - yB) / speed;

    self.renderProgressBar();

    // feedback
    this.modalBg = game.add.geom.rect(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
      colors.black,
      0
    );

    this.continueButton = game.add.geom.rect(
      context.canvas.width / 2,
      context.canvas.height / 2,
      300,
      100,
      colors.green,
      0
    );
    this.continueButton.anchor(0.5, 0.5);

    // continue
    // try again?
    this.continueText = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 + 16,
      game.lang.continue,
      textStyles.btn
    );
    this.continueText.alpha = 0;

    // FOR MOODLE
    if (moodle) {
    } else {
      navigation.add.left(['back', 'menu'], 'customMenu');
    }

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    self.moveCounter++;

    if (isDebugMode && debugState.end.skip) {
      curMapPosition = 4;
    }

    if (isDebugMode && debugState.map.skip) {
      // programmatically skip map
      curMapPosition++;
      self.loadGame();
    }

    if (self.moveCounter > 60) {
      // Wait 1 second before moving or staring a game

      if (canGoToNextMapPosition) {
        // Move character on screen for 1 second
        self.character.x += self.speedX;
        self.character.y -= self.speedY;
        if (
          Math.ceil(self.character.x) >=
          self.scene.roadPoints.x[curMapPosition + 1]
        ) {
          // Reached next map position
          canGoToNextMapPosition = false;
          curMapPosition++; // Set new next position
        }
      }

      if (!canGoToNextMapPosition) {
        self.waitUserAction = true;
        self.modalBg.alpha = 0.25;
        self.continueText.alpha = 1;
        self.continueButton.alpha = 1;
        //endUpdate = true;
      }
    }

    game.render.all();
  },

  /**
   * Calls game state
   */
  loadGame: function () {
    if (curMapPosition <= 4) game.state.start('' + gameName);
    else game.state.start('end');
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    if (game.math.isOverIcon(x, y, self.continueButton)) {
      self.loadGame();
    }

    navigation.onInputDown(x, y);
  },

  /**
   * Called by mouse move event
   *
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let overIcon;

    if (game.math.isOverIcon(x, y, self.continueButton)) {
      overIcon = true;
    }

    // Update gui
    if (overIcon) {
      // If pointer is over icon
      document.body.style.cursor = 'pointer';
      self.continueButton.scale = self.continueButton.initialScale * 1.1;
      self.continueText.style = textStyles.btnLg;
    } else {
      // If pointer is not over icon
      self.continueButton.scale = self.continueButton.initialScale * 1;
      self.continueText.style = textStyles.btn;
      document.body.style.cursor = 'auto';
    }

    navigation.onInputOver(x, y);
  },

  renderProgressBar: function () {
    const percentText = completedLevels * 25;
    const x0 = 300;
    const y0 = 20;

    // Bar content
    for (let i = 0; i < completedLevels; i++) {
      game.add.image(
        context.canvas.width - x0 + 37.5 * i,
        y0,
        'progress_bar_tile'
      );
    }

    // Bar wrapper
    game.add.geom.rect(
      context.canvas.width - x0 + 1,
      y0 + 1,
      150, //149,
      35, //34,
      'transparent',
      1,
      colors.blue,
      3
    );

    // percentage label
    game.add.text(
      context.canvas.width - x0 + 160,
      y0 + 33,
      percentText + '%',
      textStyles.h2_
    ).align = 'left';

    // Difficulty label
    game.add.text(
      context.canvas.width - x0 - 10,
      y0 + 33,
      game.lang.difficulty + ' ' + gameDifficulty,
      textStyles.h2_
    ).align = 'right';
  },
};
