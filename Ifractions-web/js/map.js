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

    // Background color
    game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, undefined, 0, colors.blueBckg, 1);

    // Map
    game.add.image(0, 40, 'bgmap');

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigationIcons.add(
        false, false, false, // Left icons
        false, false,        // Right icons
        false, false);
    } else {
      navigationIcons.add(
        true, true, false, // Left icons
        false, false,      // Right icons
        'customMenu', false);
    }

    // Progress bar
    const percentText = completedLevels * 25;

    if (completedLevels >= 4) game.add.geom.rect(660, 10, 4 * 37.5, 35, undefined, 0, colors.intenseGreen, 0.5);
    else game.add.geom.rect(660, 10, completedLevels * 37.5, 35, undefined, 0, colors.yellow, 0.9);

    game.add.geom.rect(661, 11, 149, 34, colors.blue, 3, undefined, 1); // Box
    game.add.text(820, 38, percentText + '%', textStyles.h2_blue).align = 'left';
    game.add.text(650, 38, game.lang.difficulty + ' ' + gameDifficulty, textStyles.h2_blue).align = 'right';

    // Map positions
    this.points = {
      x: [90, 204, 318, 432, 546, 660],
      y: [486, 422, 358, 294, 230, 166]
    };

    if (gameType == 'squareOne') {
      // Garage
      game.add.image(this.points.x[0], this.points.y[0], 'garage', 0.4).anchor(0.5, 1);
      // Farm
      game.add.image(this.points.x[5], this.points.y[5], 'farm', 0.6).anchor(0.1, 0.7);
    } else {
      // House
      game.add.image(this.points.x[0], this.points.y[0], 'house', 0.7).anchor(0.7, 0.8);
      // School
      game.add.image(this.points.x[5], this.points.y[5], 'school', 0.35).anchor(0.2, 0.7);
    }

    // Rocks and bushes
    const rocks = {
      x: [156, 275, 276, 441, 452, 590, 712],
      y: [309, 543, 259, 156, 419, 136, 316],
      type: [1, 1, 2, 1, 2, 2, 2]
    };

    for (let i in rocks.type) {
      if (rocks.type[i] == 1) {
        game.add.image(rocks.x[i], rocks.y[i], 'rock', 0.32).anchor(0.5, 0.95);
      } else {
        game.add.image(rocks.x[i], rocks.y[i], 'bush', 0.4).anchor(0.5, 0.95);
      }
    }

    // Trees
    const trees = {
      x: [105, 214, 354, 364, 570, 600, 740, 779],
      y: [341, 219, 180, 520, 550, 392, 488, 286],
      type: [2, 4, 3, 4, 1, 2, 4, 4]
    };

    for (let i in trees.type) {
      game.add.image(trees.x[i], trees.y[i], 'tree' + trees.type[i], 0.6).anchor(0.5, 0.95);
    }

    // Map positions
    for (let i = 1; i < this.points.x.length - 1; i++) {

      const aux = (i < mapPosition || (mapMove && i == mapPosition)) ? 'place_on' : 'place_off';

      // Map road positions - game levels
      game.add.image(this.points.x[i], this.points.y[i], aux, 0.3).anchor(0.5, 0.5);

      // Map road signs - game level number
      game.add.image(this.points.x[i] - 20, this.points.y[i] - 60, 'sign', 0.4).anchor(0.5, 1);
      game.add.text(this.points.x[i] - 20, this.points.y[i] - 79, i, textStyles.h2_white);

    }

    // Game Character 
    if (gameType == 'squareOne') {

      if (gameOperation == 'Plus') {
        this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'tractor', 0, 0.5);
        this.character.animation = ['green_tractor', [0, 1, 2, 3, 4], 3];
      } else {
        this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'tractor', 10, 0.5);
        this.character.animation = ['red_tractor', [10, 11, 12, 13, 14], 3];
      }

      this.character.rotate = -30; // 25 anticlock

    } else {

      this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'kid_run', 0, 0.4);
      this.character.animation = ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];

    }

    this.character.anchor(0.5, 1);
    game.animation.play(this.character.animation[0]);

    this.count = 0;

    const speed = 60;
    const xA = this.points.x[mapPosition];
    const yA = this.points.y[mapPosition];
    const xB = this.points.x[mapPosition + 1];
    const yB = this.points.y[mapPosition + 1];
    self.speedX = (xB - xA) / speed;
    self.speedY = (yA - yB) / speed;

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);

  },

  /**
   * Game loop
   */
  update: function () {

    let endUpdate = false;

    self.count++;

    if (self.count > 60) { // Wait 1 second before moving or staring a game

      if (mapMove) { // Move character on screen for 1 second
        self.character.x += self.speedX;
        self.character.y -= self.speedY;
        if (Math.ceil(self.character.x) >= self.points.x[mapPosition + 1]) { // Reached next map position
          mapMove = false;
          mapPosition++; // Set new next position
        }
      }

      if (!mapMove) {
        endUpdate = true;
      }


    }

    game.render.all();

    if (endUpdate) {
      game.animation.stop(self.character.animation[0]);
      self.loadGame();
    }

  },

  /**
   * Calls game state
   */
  loadGame: function () {

    if (audioStatus) game.audio.beepSound.play();

    if (mapPosition <= 4) game.state.start('' + gameType);
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
    navigationIcons.onInputDown(x, y);
  },

  /**
   * Called by mouse move event
   * 
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    navigationIcons.onInputOver(x, y);
  }

};

/** [ENDING STATE] Ending screen shown when the player has completed all 4 levels and therefore completed the game.
 * 
 * @namespace
 */
const endState = {

  /**
   * Main code
   */
  create: function () {

    self.preAnimate = false;
    self.animate = true;

    // Background color
    game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, undefined, 0, colors.blueBckg, 1);

    // Background
    game.add.image(0, 0, 'bgimage');

    // Clouds
    game.add.image(300, 100, 'cloud');
    game.add.image(660, 80, 'cloud');
    game.add.image(110, 85, 'cloud', 0.8);

    // Floor
    for (let i = 0; i < 9; i++) { game.add.image(i * 100, context.canvas.height - 100, 'floor'); }

    // Progress bar
    game.add.geom.rect(660, 10, 4 * 37.5, 35, undefined, 0, colors.intenseGreen, 0.5); // Progress
    game.add.geom.rect(661, 11, 149, 34, colors.blue, 3, undefined, 1); // Box
    game.add.text(820, 38, '100%', textStyles.h2_blue).align = 'left';
    game.add.text(650, 38, game.lang.difficulty + ' ' + gameDifficulty, textStyles.h2_blue).align = 'right';

    game.add.image(360, 545, 'tree4', 0.7).anchor(0, 1);

    // Level character
    switch (gameType) {

      case 'circleOne':

        this.preAnimate = true;
        this.animate = false;

        // School
        game.add.image(600, 222, 'school', 0.7);

        // Kid
        this.character = game.add.sprite(0, -152, 'kid_run', 0, 0.7);
        this.character.anchor(0.5, 0.5);
        this.character.animation = ['move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3];

        // Balloon
        this.balloon = game.add.image(0, -260, 'balloon');
        this.balloon.anchor(0.5, 0.5);

        this.basket = game.add.image(0, -150, 'balloon_basket');
        this.basket.anchor(0.5, 0.5);

        break;

      case 'squareTwo':

        // School
        game.add.image(600, 222, 'school', 0.7);

        // Kid
        this.character = game.add.sprite(0, 460, 'kid_run', 6, 0.7);
        this.character.anchor(0.5, 0.5);
        this.character.animation = ['move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3];

        break;

      case 'squareOne':

        // Farm
        game.add.image(650, 260, 'farm', 1.1);

        // Tractor
        this.character = game.add.sprite(0, 490, 'tractor', 0, 0.7);
        this.character.anchor(0.5, 0.5);
        if (gameOperation == 'Plus') {
          this.character.animation = ['move', [0, 1, 2, 3, 4], 4];
        } else {
          this.character.curFrame = 10;
          this.character.animation = ['move', [10, 11, 12, 13, 14], 4];
        }

        break;

    }

    if (this.animate) game.animation.play(this.character.animation[0]);

    game.add.image(30, 585, 'tree4', 0.85).anchor(0, 1);

  },

  /**
   * Game loop
   */
  update: function () {

    // Balloon falling
    if (self.preAnimate) {

      if (self.character.y < 460) {

        self.balloon.y += 2;
        self.basket.y += 2;
        self.character.y += 2;

        self.balloon.x++;
        self.basket.x++;
        self.character.x++;

      } else {

        self.preAnimate = false;
        self.animate = true;
        game.animation.play(self.character.animation[0]);

      }

    }

    // Character running
    if (self.animate) {

      if (self.character.x <= 700) {

        self.character.x += 2;

      } else {

        self.animate = false;
        game.animation.stop(self.character.animation[0]);

        // FOR MOODLE
        if (!moodle) {
          completedLevels = 0;
          game.state.start('menu');
        } else {
          // FOR MOODLE
          parent.location.reload(true);          
        }

      }

    }

    game.render.all();

  }

};