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
    game.load.sprite(url[gameType].sprite);
    game.load.image(url[gameType].image);

  },

  /**
   * Main code
   */
  create: function () {

    // FOR MOODLE
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') { // Student role

      game.state.start('map');

    } else {

      const iconScale = 0.7;
      const baseY = 270 - 40;
      this.menuIcons = [];

      // Background color
      game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, undefined, 0, colors.blueBckg, 1);
      // Floor
      for (let i = 0; i < context.canvas.width / 100; i++) { game.add.image(i * 100, context.canvas.height - 100, 'floor'); }

      // Overtitle : Selected game
      game.add.text(context.canvas.width / 2, 40, game.lang.game.toUpperCase() + ": " + menuState.menuIcons, textStyles.h4_brown);
      // Title : Customize the selected game
      game.add.text(context.canvas.width / 2, 80, game.lang.custom_game, textStyles.h1_green);

      // Loads navigation icons
      navigationIcons.add(
        true, false, false,
        true, true,
        'menu', false);

      const curGame = info.all[gameType];
      let x = 150;
      let y = 200 - 40;
      let width = 5;
      let height = 280 + 80;
      let offsetW = 600 / 6;
      let offsetH, infoIcon;

      // Label 'Game Modes'
      game.add.text(x + offsetW - 12, y, game.lang.game_modes, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 2 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameMode';
      this.menuIcons.push(infoIcon);

      // Label 'Operations'
      game.add.text(x + 3 * offsetW, y, game.lang.operations, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 4 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameOperation';
      this.menuIcons.push(infoIcon);

      // Label 'Difficulties'
      game.add.text(x + 5 * offsetW, y, game.lang.difficulties, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 6 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameDifficulty';
      this.menuIcons.push(infoIcon);

      // Horizontal line
      game.add.geom.rect(x - 25, y + 10, 600 + 50, width, undefined, 0, colors.blueMenuLine).anchor(0, 0.5);
      // Vertical lines
      game.add.geom.rect(x + 2 * offsetW, y - 25, width, height, undefined, 0, colors.blueMenuLine).anchor(0.5, 0);
      game.add.geom.rect(x + 4 * offsetW, y - 25, width, height, undefined, 0, colors.blueMenuLine).anchor(0.5, 0);

      // --------------------------- TURN ON/OFF FRACTION LABELS / RECTANGLE GUIDE

      // Horizontal line
      game.add.geom.rect(x + 4 * offsetW, y + 136, 200 + 25, width, undefined, 0, colors.blueMenuLine).anchor(0, 0.5);

      // Label 'Show Fractions / Auxiliar rectangles'
      game.add.text(x + 5 * offsetW, y + 102, game.lang.show, textStyles.h4_blue_2);

      infoIcon = game.add.image(x + 6 * offsetW + 20, y + 102, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameMisc';
      this.menuIcons.push(infoIcon);

      let auxText;
      if (gameType == 'squareTwo') {
        auxText = game.lang.aux_rectangle;
        game.add.text(x + 5 * offsetW + 10, y + 102 + 24, auxText, textStyles.h4_blue_2);
      } else {
        auxText = game.lang.title;
        game.add.text(x + 5 * offsetW, y + 102 + 24, auxText, textStyles.h2_blue_2);
      }

      // Selection box
      y += 40;
      const frame = (fractionLabel) ? 1 : 0;

      const selectionBox = game.add.sprite(x + 5 * offsetW, y + 102 + 24 - 2, 'select', frame, 0.11);
      selectionBox.anchor(0.5, 0.5);
      selectionBox.iconType = 'selectionBox';
      this.menuIcons.push(selectionBox);

      // --------------------------- GAME MODE ICONS

      x = 150 + offsetW;
      y = baseY;
      offsetH = this.getOffset(height, curGame.gameMode.length);

      for (let i = 0; i < curGame.gameModeUrl.length; i++, y += offsetH) {
        const icon = game.add.sprite(x, y, curGame.gameModeUrl[i], 0, iconScale, 1);
        icon.anchor(0.5, 0.5);

        icon.gameMode = curGame.gameMode[i];
        icon.iconType = 'gameMode';
        if (i == 0) {
          gameMode = icon.gameMode;
          icon.curFrame = 1;
        }

        this.menuIcons.push(icon);
      }

      // --------------------------- GAME OPERATION ICONS

      x += 2 * offsetW;
      y = baseY;
      offsetH = this.getOffset(height, curGame.gameOperation.length);

      let icon;

      // Placing math operation icons
      for (let i = 0; i < curGame.gameOperation.length; i++, y += offsetH) {
        icon = game.add.sprite(x, y, curGame.gameOperationUrl[i], 0, iconScale, 1);
        icon.anchor(0.5, 0.5);

        icon.gameOperation = curGame.gameOperation[i];
        icon.iconType = 'gameOperation';

        if (i == 0) {
          gameOperation = icon.gameOperation;
          icon.curFrame = 1;
        }

        this.menuIcons.push(icon);
      }

      // --------------------------- DIFFICULTY ICONS

      x = (gameType == 'squareOne') ? 625 : 585;
      y = baseY - 25;

      for (let i = 0; i < curGame.gameDifficulty; i++) {
        // Parameters
        const curX = x + (30 + 10) * i;

        // Difficulty menuIcons
        const icon = game.add.geom.rect(curX, y, 30, 30, undefined, 0, colors.gray, 1);
        icon.anchor(0.5, 0.5);
        icon.difficulty = i + 1;
        icon.iconType = 'difficulty';

        if (i == 0) {
          gameDifficulty = icon.difficulty;
          icon.fillColor = colors.blue;
        }
        this.menuIcons.push(icon);

        // Difficulty numbers
        game.add.text(curX, y + 7, i + 1, textStyles.h4_white);
      }

      // --------------------------- ENTER ICON

      // FOR MOODLE
      if (!moodle) {

        x = context.canvas.width - 100;
        y = context.canvas.height - 110;

        const enterIcon = game.add.image(x, y, 'bush');
        enterIcon.anchor(0.5, 0.5);
        enterIcon.iconType = 'enter';

        this.menuIcons.push(enterIcon);

        this.enterText = game.add.text(x, y, game.lang.continue, textStyles.h4_white);

      }

      // --------------------------- INFO BOX

      this.infoBox = document.getElementById('myModal');

      // When the user clicks on the 'x', close the modal
      document.getElementsByClassName('close')[0].onclick = function () {
        self.infoBox.style.display = 'none';
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target == self.infoBox) {
          self.infoBox.style.display = 'none';
        }
      }

      this.infoBoxContent = {

        gameMode: {
          squareOne: {
            title: '<b>' + game.lang.game_modes + '</b>',
            body: game.lang.infoBox_mode,
            img: '<table> <tr> <td> <b>A)</b> ' + game.lang.infoBox_mode_s1_A +
              ' </td> <td> <b>B)</b> ' + game.lang.infoBox_mode_s1_B +
              ' </td> </tr> <tr> <td> <img width=100% src="' + game.image['s1-A-h'].src + '"> ' +
              ' </td> <td> <img width=100% src="' + game.image['s1-B-h'].src + '"> </td> </tr> <table>'
          },
          circleOne: {
            title: '<b>' + game.lang.game_modes + '</b>',
            body: game.lang.infoBox_mode,
            img: '<table> <tr style="border-bottom: 5px solid white"> <td width=70%> <img width=100% src="' + game.image['c1-A-h'].src + '">' +
              ' </td> <td> &nbsp; <b>A)</b> ' + game.lang.infoBox_mode_c1_A +
              ' </td> </tr> </tr> <td> <img width=100% src="' + game.image['c1-B-h'].src + '"> ' +
              ' </td> <td> &nbsp; <b>B)</b> ' + game.lang.infoBox_mode_c1_B + '</td> </tr> <table>'
          },
          squareTwo: {
            title: '<b>' + game.lang.game_modes + '</b>',
            body: game.lang.infoBox_mode,
            img: '<center> <table> <tr> <td> <b>A)</b> ' + game.lang.infoBox_mode_s2_A +
              ' </td> <td> <b>B)</b> ' + game.lang.infoBox_mode_s2_B +
              ' </td> </tr> <tr> <td> <img width=98% src="' + game.image['s2-A-h'].src + '"> ' +
              ' </td> <td> <img width=98% src="' + game.image['s2-B-h'].src + '"> </td> </tr> <table> </center>'
          }
        },

        gameOperation: {
          title: '<b>' + game.lang.operation_math + '</b>',
          body: game.lang.infoBox_oper,
          img: '<center> <table> <tr style="border-bottom: 5px solid white"> <td> <img width=50 src="' + game.image['operation_plus'].src + '"> ' + game.lang.plus +
            ' </td> <td> <img width=50 src="' + game.image['operation_mixed'].src + '"> ' + game.lang.mixed +
            ' </td> </tr> <tr> <td><img width=50 src="' + game.image['operation_minus'].src + '"> ' + game.lang.minus +
            ' &nbsp; </td> <td> <img width=50 src="' + game.image['operation_equals'].src + '"> ' + game.lang.equals + ' </td> </tr> <table> <center>',
        },

        gameDifficulty: {
          squareOne: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff + ' ' + game.lang.infoBox_diff_obs,
            img: '<table> <tr> <td> <b>' + game.lang.difficulty + ':</b> 1' +
              ' </td> <td> <b>' + game.lang.difficulty + ':</b> 3' +
              ' </td> </tr> <tr> <td> <img width=100% src="' + game.image['s1-diff-1'].src + '"> ' +
              ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' + game.image['s1-diff-3'].src + '"> </td> </tr> </table> <br>' +
              game.lang.infoBox_diff_aux + '<center> <img width=50% src="' + game.image['map-s1'].src + '"> </center>'
          },
          circleOne: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff + ' ' + game.lang.infoBox_diff_obs,
            img: '<center> <table> <tr> <td style="border-right: 4px solid white"> <b>' + game.lang.difficulty + ':</b> 1' +
              ' </td> <td> <b>' + game.lang.difficulty + ':</b> 5' +
              ' </td> </tr> <tr> <td> <img width=100% src="' + game.image['c1-diff-1'].src + '"> ' +
              ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' + game.image['c1-diff-5'].src + '"> </td> </tr> </table> <center> <br>' +
              game.lang.infoBox_diff_aux + '<center> <img width=50% src="' + game.image['map-c1s2'].src + '"> </center>'
          },
          squareTwo: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff,
            img: '<table> <tr> <td> <b>' + game.lang.difficulty + ':</b> 1' +
              ' </td> <td> <b>' + game.lang.difficulty + ':</b> 5' +
              ' </td> </tr> <tr> <td> <img width=100% src="' + game.image['s2-diff-1'].src + '"> ' +
              ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' + game.image['s2-diff-5'].src + '"> </td> </tr> </table> <br>' +
              game.lang.infoBox_diff_aux + '<center> <img width=50% src="' + game.image['map-c1s2'].src + '"> </center>'
          },
        },

        gameMisc: {
          squareOne: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_label,
            img: '<center> <img width=80% src="' + game.image['s1-label'].src + '"> </center>',
          },
          circleOne: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_label,
            img: '<center> <img width=60% src="' + game.image['c1-label'].src + '"> </center>',
          },
          squareTwo: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_rect,
            img: '<center> <img width=100% src="' + game.image['s2-label'].src + '"> </center>',
          }
        }

      };

      // ------------- EVENTS

      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);

    }

  },

  /**
   * Displays game menu information boxes.
   */
  showInfoBox: function (icon) {
    self.infoBox.style.display = 'block';

    const element = (icon.id == 'gameOperation') ? self.infoBoxContent[icon.id] : self.infoBoxContent[icon.id][gameType];

    let msg = '<h3>' + element.title + '</h3>'
      + '<p align=justify>' + element.body + '</p>'
      + element.img;

    document.getElementById('infobox-content').innerHTML = msg;
  },

  /**
   * Saves information selected by the player 
   * 
   * @param {object} icon selected icon
   */
  load: function (icon) {

    if (audioStatus) game.audio.beepSound.play();

    const type = icon.iconType;
    switch (type) {
      case 'gameMode': gameMode = icon.gameMode; break;
      case 'gameOperation': gameOperation = icon.gameOperation; break;
      case 'difficulty': gameDifficulty = icon.difficulty; break;
      case 'infoIcon': self.showInfoBox(icon); break;
      case 'selectionBox':
        if (icon.curFrame == 0) {
          icon.curFrame = 1;
          fractionLabel = true;
        } else {
          icon.curFrame = 0;
          fractionLabel = false;
        }
        game.render.all();
        break;
      case 'enter':
        if (debugMode) {
          console.log('------------------------------'+
          '\nGame State: ' + gameType +
          '\nGame Mode: ' + gameMode + 
          '\n------------------------------');
        }
        mapPosition = 0;  // Map position
        mapMove = true; // Move no next point
        completedLevels = 0;  // Reset the game progress when entering a new level
        game.state.start('map');
        break;
    }

  },

  /**
   * Calculate spacing for icons on the menu screen
   * 
   * @param {number} width width of the available part of the screen
   * @param {number} numberOfIcons number or icons to be put on the screen
   * 
   * @returns {number} correct spacing between icons
   */
  getOffset: function (width, numberOfIcons) {
    return width / (numberOfIcons + 1);
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
    if (overIcon) { // If has clicked on an icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach(cur => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) { // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) { // If its the clicked icon
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 1;
            else if (cur.iconType == 'difficulty') cur.fillColor = colors.blue;
          } else {
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 0;
            else if (cur.iconType == 'difficulty') cur.fillColor = colors.gray;
          }
        }
      });

      self.load(self.menuIcons[overIcon]);

    } else document.body.style.cursor = 'auto';

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
    let overIcon;

    // Check if pointer is over an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) { // If pointer is over icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach(cur => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) { // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) { // If its the icon the pointer is over 
            if (cur.iconType == 'enter') self.enterText.style = textStyles.h3__white;
            cur.scale = cur.originalScale * 1.1;
          } else {
            cur.scale = cur.originalScale;
          }
        }
      });
    } else { // If pointer is not over icon
      if (self.enterText) self.enterText.style = textStyles.h4_white;
      self.menuIcons.forEach(cur => { cur.scale = cur.originalScale; });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.onInputOver(x, y);

    game.render.all();

  }

}