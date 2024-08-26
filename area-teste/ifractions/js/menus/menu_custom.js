/******************************
 * This file holds game states.
 ******************************/

/** [CUSTOM MENU STATE] Screen where the user can customise the selected game - game mode, math operation, level of difficulty.
 *
 * @namespace
 */
const customMenuState = {
  /**
   * Preloads media for current state
   */
  preload: function () {
    // LOADING MEDIA
    game.load.sprite(url[gameName].sprite);
    game.load.image(url[gameName].image);
  },

  /**
   * Main code
   */
  create: function () {
    // FOR MOODLE
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') {
      // Student role
      game.state.start('map');
    } else {
      renderBackground();

      // Overtitle : Selected game
      game.add.text(
        context.canvas.width / 2,
        60,
        game.lang.game.toUpperCase() + ': ' + menuState.menuIcons,
        { ...textStyles.h3_, fill: colors.maroon }
      );
      // Title : Customize the selected game
      game.add.text(context.canvas.width / 2, 120, game.lang.custom_game, {
        ...textStyles.h1_,
        fill: colors.green,
      });

      // Loads navigation icons
      navigation.add.left(['back'], 'menu');
      navigation.add.right(['audio', 'lang']);

      const curGame = gameList[gameId];

      this.menuIcons = [];

      let offsetW = game.math.getOffset(getFrameInfo().width, 5);
      let offsetH = game.math.getOffset(
        getFrameInfo().height,
        curGame.gameMode.length
      );

      let x = getFrameInfo().x;
      let y = getFrameInfo().y;

      this.renderSectionTitles(x, y, offsetW, offsetH);
      this.renderCheckBox(x, y, offsetW, offsetH);
      this.renderModeSection(x, y, offsetW, offsetH, curGame);
      this.renderOperationSection(x, y, offsetW, offsetH, curGame);
      this.renderDifficultySection(x, y, offsetW, offsetH, curGame);
      this.renderEnterSection(x, y);

      this.setInfoBoxes();

      // ------------- EVENTS

      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);

      if (isDebugMode && debugState.customMenu.skip) {
        // programmatically customize a game
        const { mode, operation, difficulty, label } =
          debugState.customMenu.getData();

        gameMode = mode;
        gameOperation = operation;
        gameDifficulty = difficulty || 1;
        showFractions = label || true;

        curMapPosition = 0; // Map position
        canGoToNextMapPosition = true; // Move no next point
        completedLevels = 0; // Reset the game progress when entering a new level
        game.state.start('map');
      }
    }
  },

  /**
   * Saves information selected by the player
   *
   * @param {object} icon selected icon
   */
  load: function (icon) {
    const type = icon.iconType;

    if (audioStatus) game.audio.popSound.play();

    switch (type) {
      case 'gameMode':
        gameMode = icon.gameMode;
        break;
      case 'gameOperation':
        gameOperation = icon.gameOperation;
        break;
      case 'difficulty':
        gameDifficulty = icon.difficulty;
        break;
      case 'infoIcon':
        self.showInfoBox(icon);
        break;
      case 'selectionBox':
        if (icon.curFrame == 0) {
          icon.curFrame = 1;
          showFractions = true;
        } else {
          icon.curFrame = 0;
          showFractions = false;
        }
        game.render.all();
        break;
      case 'enter':
        if (isDebugMode) {
          console.log(
            '------------------------------' +
              '\nGame Mode: ' +
              gameMode +
              '\nGame Operation: ' +
              gameOperation +
              '\nGame Difficulty: ' +
              gameDifficulty +
              '\nDisplay Fraction Labels: ' +
              showFractions +
              '\n------------------------------'
          );
        }
        curMapPosition = 0; // Map position
        canGoToNextMapPosition = true; // Move no next point
        completedLevels = 0; // Reset the game progress when entering a new level
        game.state.start('map');
        break;
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
    let overIcon;

    // Check if clicked on an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) {
      // If has clicked on an icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the clicked icon
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation')
              cur.curFrame = 1;
            else if (cur.iconType == 'difficulty') cur.curFrame = 0;
          } else {
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation')
              cur.curFrame = 0;
            else if (cur.iconType == 'difficulty') cur.curFrame = 1;
          }
        }
      });

      self.load(self.menuIcons[overIcon]);
    } else document.body.style.cursor = 'auto';

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
    let overIcon;

    // Check if pointer is over an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) {
      // If pointer is over icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the icon the pointer is over
            if (cur.iconType == 'enter')
              self.enterText.style = textStyles.btnLg;
            cur.scale = cur.initialScale * 1.1;
          } else {
            cur.scale = cur.initialScale;
          }
        }
      });
    } else {
      // If pointer is not over icon
      if (self.enterText) self.enterText.style = textStyles.btn;
      self.menuIcons.forEach((cur) => {
        cur.scale = cur.initialScale;
      });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigation.onInputOver(x, y);

    game.render.all();
  },

  renderSectionTitles: function (x, y, offsetW, offsetH) {
    let infoIcon;

    // Label 'Game Modes'
    game.add.text(x + offsetW, y, game.lang.game_modes, textStyles.h2_);

    infoIcon = game.add.image(x + 2 * offsetW - 30, y - 20, 'info', 0.7, 0.8);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameMode';
    self.menuIcons.push(infoIcon);

    // Label 'Operations'
    game.add.text(x + 3 * offsetW, y, game.lang.operations, textStyles.h2_);

    infoIcon = game.add.image(x + 4 * offsetW - 30, y - 20, 'info', 0.7, 0.8);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameOperation';
    self.menuIcons.push(infoIcon);

    // Label 'Difficulties'
    game.add.text(x + 5 * offsetW, y, game.lang.difficulties, textStyles.h2_);

    infoIcon = game.add.image(x + 6 * offsetW - 30, y - 20, 'info', 0.7, 0.8);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameDifficulty';
    self.menuIcons.push(infoIcon);

    gameList[gameId].assets.customMenu.auxiliarTitle(x, y, offsetW, offsetH);
  },

  renderCheckBox: function (x, y, offsetW, offsetH) {
    y += 60;
    const frame = showFractions ? 1 : 0;

    const selectionBox = game.add.sprite(
      x + 5 * offsetW,
      y + offsetH + 90,
      'select_input',
      frame,
      1.4
    );
    selectionBox.anchor(0.5, 0.5);
    selectionBox.iconType = 'selectionBox';
    self.menuIcons.push(selectionBox);
  },

  renderModeSection: function (x, y, offsetW, offsetH, curGame) {
    x = getFrameInfo().x + offsetW;
    y = getFrameInfo().y + offsetH / 2;

    if (!gameMode) gameMode = gameList[gameId].gameMode[0];

    for (
      let i = 0;
      i < curGame.assets.customMenu.gameModeBtn.length;
      i++, y += offsetH
    ) {
      const icon = game.add.sprite(
        x,
        y,
        curGame.assets.customMenu.gameModeBtn[i],
        0,
        1,
        1
      );
      icon.anchor(0.5, 0.5);

      icon.gameMode = curGame.gameMode[i];
      icon.iconType = 'gameMode';

      if (gameList[gameId].gameMode[i] == gameMode) {
        icon.curFrame = 1;
      }

      self.menuIcons.push(icon);
    }
  },

  renderOperationSection: function (x, y, offsetW, offsetH, curGame) {
    x += 3 * offsetW;
    y = getFrameInfo().y + offsetH / 2;

    offsetH = game.math.getOffset(
      getFrameInfo().height,
      curGame.gameOperation.length - 1
    );

    if (!gameOperation) gameOperation = gameList[gameId].gameOperation[0];

    let icon;

    // Placing math operation icons
    for (let i = 0; i < curGame.gameOperation.length; i++, y += offsetH) {
      icon = game.add.sprite(
        x,
        y,
        curGame.assets.customMenu.gameOperationBtn[i],
        0,
        1,
        1
      );
      icon.anchor(0.5, 0.5);

      icon.gameOperation = curGame.gameOperation[i];
      icon.iconType = 'gameOperation';

      if (gameList[gameId].gameOperation[i] == gameOperation) {
        icon.curFrame = 1;
      }

      self.menuIcons.push(icon);
    }
  },

  renderDifficultySection: function (x, y, offsetW, offsetH, curGame) {
    x = getFrameInfo().x - 50 + 5 * offsetW;

    offsetH = game.math.getOffset(
      getFrameInfo().height,
      curGame.gameMode.length
    );

    y = getFrameInfo().y + offsetH / 3;

    if (!gameDifficulty) gameDifficulty = 1;

    if (gameName === 'squareTwo') x -= 70;

    for (let i = 0; i < curGame.gameDifficulty; i++) {
      // Parameters
      const curX = x + (50 + 10) * i;

      const icon = game.add.sprite(curX, y - 5, 'btn_square', 1, 0.8);
      icon.anchor(0.5, 0.5);
      icon.difficulty = i + 1;
      icon.iconType = 'difficulty';

      if (i == gameDifficulty - 1) {
        icon.curFrame = 0;
      }
      self.menuIcons.push(icon);

      // Difficulty numbers
      game.add.text(curX, y + 7, i + 1, textStyles.h4_);
    }
  },

  renderEnterSection: function (x, y) {
    // FOR MOODLE
    if (!moodle) {
      x = context.canvas.width - 150;
      y = context.canvas.height - 180;

      const enterIcon = game.add.image(x, y, 'bush', 2);
      enterIcon.anchor(0.5, 0.5);
      enterIcon.iconType = 'enter';

      self.menuIcons.push(enterIcon);

      self.enterText = game.add.text(x, y, game.lang.continue, textStyles.btn);
    }
  },

  setInfoBoxes: function () {
    // --------------------------- INFO BOX

    self.infoBox = document.querySelector('.ifr-modal');

    // When the user clicks on the 'x', close the modal
    document.querySelector('.ifr-modal__closeButton').onclick = function () {
      self.infoBox.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == self.infoBox) {
        self.infoBox.style.display = 'none';
      }
    };

    self.gameOperationContent = {
      title: game.lang.operation_math,
      body: game.lang.infoBox_oper,
      img: `<table class="table">
        <tr>
          <td><img width=50 src="${game.image['op_plus'].src}"></td>
          <td><img width=50 src="${game.image['op_mix'].src}"></td>
          <td><img width=50 src="${game.image['op_min'].src}"></td>
          <td><img width=50 src="${game.image['op_eq'].src}"></td>
        </tr>
        <tr>
          <td class="text-center">${game.lang.plus}</td>
          <td class="text-center">${game.lang.mixed}</td>
          <td class="text-center">${game.lang.minus}</td>
          <td class="text-center">${game.lang.equals}</td>
        </tr>
      </table>`,
    };
  },

  /**
   * Displays game menu information boxes.
   */
  showInfoBox: function (icon) {
    self.infoBox.style.display = 'block';

    const data =
      icon.id == 'gameOperation'
        ? self.gameOperationContent
        : gameList[gameId].assets.customMenu.infoBox()[icon.id];

    const content = `<h2>${data.title}</h2>
    <div>${data.body}</div>
    ${data.img}`;

    document.querySelector('.ifr-modal__infobox').innerHTML = content;
  },
};
