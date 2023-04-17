/******************************
 * This file holds game states.
 ******************************/

/** [ENDING STATE] Ending screen shown when the player has completed all 4 levels and therefore completed the game.
 *
 * @namespace
 */
const endState = {
  ui: undefined,
  control: undefined,

  character: undefined,
  balloon: undefined,
  basket: undefined,

  /**
   * Main code
   */
  create: function () {
    this.control = {
      animate: true,
      preAnimate: false,
      waitUserAction: false,
      endUpdate: false,
      counter: 0,
      direc: 1,
    };

    this.ui = {
      continue: {
        button: undefined,
        text: undefined,
      },
    };

    renderBackground('end');

    self.utils.renderProgressBar();

    // Back trees
    game.add
      .image(-100, context.canvas.height - 200, 'tree_4', 1.05)
      .anchor(0, 1);
    game.add
      .image(360 + 400 + 400, context.canvas.height - 200, 'tree_4', 1.05)
      .anchor(0, 1);

    self.utils.renderCharacters();
    if (this.control.animate) game.animation.play(this.character.animation[0]);

    // Front tree
    game.add
      .image(30 + 200 + 100, context.canvas.height - 30, 'tree_4', 1.275)
      .anchor(0, 1);

    game.event.add('click', this.events.onInputDown);
    game.event.add('mousemove', this.events.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    if (isDebugMode) {
      if (debugState.end.skip && debugState.end.stop) {
        self.control.animate = false;
      }

      if (debugState.moodle.emulate) {
        moodleVar = debugState.moodle.info;
        game.state.start('studentReport');
        return;
      }
    }

    self.control.counter++;

    // Balloon falling
    if (self.control.preAnimate) {
      const speedY = 3,
        speedX = 2;
      if (self.basket.y < context.canvas.height - 240) {
        self.balloon.y += speedY;
        self.basket.y += speedY;
        self.character.y += speedY;

        self.balloon.x += speedX;
        self.basket.x += speedX;
        self.character.x += speedX;
      } else {
        self.control.preAnimate = false;
        self.control.animate = true;
        game.animation.play(self.character.animation[0]);
      }
    }

    if (gameName == 'circleOne') {
      if (self.control.counter % 40 === 0) {
        self.balloon.x += 5 * self.control.direc;
        self.control.direc *= -1;
      }
    }

    // Character running
    if (self.control.animate) {
      if (self.character.x <= 1550) {
        self.character.x += 4;
      } else {
        self.control.animate = false;
        game.animation.stop(self.character.animation[0]);
        self.character.alpha = 0;
        self.control.waitUserAction = true;
        self.utils.renderEndUI();
      }
    }

    if (self.control.endLevel) {
      // FOR MOODLE
      if (!moodle) {
        completedLevels = 0;
        game.state.start('menu');
      } else {
        // FOR MOODLE
        parent.location.reload(true);
      }
    }

    game.render.all();
  },

  utils: {
    renderProgressBar: () => {
      const x0 = 300;
      const y0 = 20;

      // Bar content
      for (let i = 0; i < 4; i++) {
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
        149, //150, //149,
        34, //35, //34,
        'transparent',
        1,
        colors.blue,
        3
      );

      // percentage label
      game.add.text(
        context.canvas.width - x0 + 160,
        y0 + 33,
        '100%',
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
    renderCharacters: () => {
      gameList[gameId].assets.end.building();

      self.character = gameList[gameId].assets.end.character();
      self.character.animation =
        gameList[gameId].assets.end.characterAnimation();

      if (gameName === 'circleOne') {
        self.control.preAnimate = true;
        self.control.animate = false;

        // Balloon
        self.balloon = game.add.image(0, -350, 'balloon', 1.5);
        self.balloon.anchor(0.5, 0.5);

        self.basket = game.add.image(0, -150, 'balloon_basket', 1.5);
        self.basket.anchor(0.5, 0.5);

        self.character.curFrame = 6;
      }
    },
    renderEndUI: () => {
      const btnY = context.canvas.height / 2;

      // Continue Button
      self.ui.continue.button = game.add.geom.rect(
        context.canvas.width / 2,
        btnY,
        600,
        100,
        colors.green
      );
      self.ui.continue.button.anchor(0.5, 0.5);

      // Continue button text
      self.ui.continue.text = game.add.text(
        context.canvas.width / 2,
        btnY + 16,
        game.lang.back_to_menu,
        textStyles.btn
      );

      // Title
      const font = { ...textStyles.btnLg };
      font.fill = colors.blue;
      game.add.text(
        context.canvas.width / 2,
        btnY - 100,
        game.lang.congratulations,
        font
      );
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

      if (self.control.waitUserAction) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          self.control.endLevel = true;
        }
      }
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

      if (self.control.waitUserAction) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          // If pointer is over icon
          document.body.style.cursor = 'pointer';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1.1;
          self.ui.continue.text.style = textStyles.btnLg;
        } else {
          // If pointer is not over icon
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1;
          document.body.style.cursor = 'auto';
          self.ui.continue.text.style = textStyles.btn;
        }
      }
    },
  },
};
