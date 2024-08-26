/******************************
 * This file holds game states.
 ******************************/

/** [MAIN MENU STATE] Screen where the user can select a game.
 *
 * @namespace
 */
const menuState = {
  /**
   * Main code
   */
  create: function () {
    // FOR MOODLE
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') {
      // Student role

      playerName = game.lang.student; // TODO pegar o nome do aluno no bd do moodle
      try {
        getiLMContent();
      } catch (error) {
        console.error(
          'Game error: Could not load the iLM Content on Moodle. ' + error
        );
      }
    } else {
      // FOR MOODLE
      if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'true') {
        playerName = game.lang.professor;
      } else {
        // reset game values
        gameId = null;
        gameMode = null;
        gameOperation = null;
        gameDifficulty = null;
        showFractions = true;
      }

      renderBackground();

      // Overtitle: Welcome, <player name>!
      game.add.text(
        context.canvas.width / 2,
        60,
        game.lang.welcome + ', ' + playerName + '!',
        { ...textStyles.h3_, fill: colors.maroon }
      );
      // Title : Select a game
      game.add.text(context.canvas.width / 2, 120, game.lang.menu_title, {
        ...textStyles.h1_,
        fill: colors.green,
      });
      // Subtitle : <game mode>
      this.lbl_game = game.add.text(
        context.canvas.width / 2,
        170,
        '',
        textStyles.h2_
      );

      // Loads navigation icons
      navigation.add.right(['audio', 'lang']);

      this.menuIcons = [];

      // --------------------------- GAME ICONS

      const offset = game.math.getOffset(context.canvas.width, gameList.length);

      for (let i = 0, x = offset; i < gameList.length; i++, x += offset) {
        const icon = game.add.image(
          x,
          context.canvas.height / 2 - 70,
          gameList[i].assets.menu.gameNameBtn,
          1.5
        );
        icon.anchor(0.5, 0.5);

        icon.gameId = i;
        icon.iconType = 'game';

        this.menuIcons.push(icon);

        // "more information" button
        const infoIcon = game.add.image(
          x + 110,
          context.canvas.height / 2 - 100 - 80 - 10,
          'info',
          0.8,
          0.6
        );
        infoIcon.anchor(0.5, 0.5);
        infoIcon.iconType = 'infoIcon';
        infoIcon.id = i;
        this.menuIcons.push(infoIcon);
      }

      // --------------------------- INFO BOX

      this.setInfoBoxes();

      // ------------- EVENTS

      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);

      if (isDebugMode && debugState.menu.skip) {
        // programmatically select a game
        const id = debugState.menu.id;
        gameId = id;
        gameName = gameList[id].gameName;
        gameShape = gameList[id].gameShape;
        audioStatus = debugState.menu.audioStatus || false;
        self.menuIcons =
          game.lang[gameShape] + ' ' + gameName.slice(-3) == 'One' ? 'I' : 'II';
        game.state.start('customMenu');
      }
    }
  },

  setInfoBoxes: function () {
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
  },

  /**
   * Displays game menu information boxes.
   */
  showInfoBox: function (icon) {
    if (
      gameList[icon.id] &&
      gameList[icon.id].assets &&
      gameList[icon.id].assets.menu &&
      gameList[icon.id].assets.menu.infoBox
    ) {
      self.infoBox.style.display = 'block';

      const data = gameList[icon.id].assets.menu.infoBox();

      const content = `<h3>${data.title}</h3>
      <p>${data.body}</p>
      ${data.img}`;

      document.querySelector('.ifr-modal__infobox').innerHTML = content;
    } else {
      console.error('Error: no info box was setup for this game.');
    }
  },

  /**
   * Saves info from selected game and goes to next state
   *
   * @param {object} icon clicked icon
   */
  load: function (icon) {
    if (audioStatus) game.audio.popSound.play();

    switch (icon.iconType) {
      case 'infoIcon':
        self.showInfoBox(icon);
        break;
      case 'game':
        gameId = icon.gameId;
        gameName = gameList[gameId].gameName;
        gameShape = gameList[gameId].gameShape;

        if (!gameList.find((game) => game.gameName === gameName))
          console.error('Game error: the name of the game is not valid.');
        if (isDebugMode) console.log('Game Name: ' + gameName);

        self.menuIcons = self.lbl_game.name;

        game.state.start('customMenu');
        break;
    }
  },

  /**
   * Display the name of the game on screen
   *
   * @param {object} icon icon for the game
   */
  showTitle: function (icon) {
    const number =
      gameList[icon.gameId].gameName.slice(-3) == 'One' ? 'I' : 'II';
    const shape = gameList[icon.gameId].gameName.slice(0, -3);
    self.lbl_game.name = game.lang[shape] + ' ' + number;
  },

  /**
   * Remove the name of the game from screen
   */
  clearTitle: function () {
    self.lbl_game.name = '';
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    // Check menu icons
    for (let i in self.menuIcons) {
      // If mouse is within the bounds of an icon
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        // Click first valid icon
        self.load(self.menuIcons[i]);
        break;
      }
    }

    // Check navigation icons
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

    // Check menu icons
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
      if (self.menuIcons[overIcon].iconType == 'game')
        self.showTitle(self.menuIcons[overIcon]);
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the icon the pointer is over
            cur.scale = cur.initialScale * 1.1;
          } else {
            cur.scale = cur.initialScale;
          }
        }
      });
    } else {
      // If pointer is not over icon
      self.clearTitle();
      self.menuIcons.forEach((cur) => {
        cur.scale = cur.initialScale;
      });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigation.onInputOver(x, y);

    game.render.all();
  },
};
