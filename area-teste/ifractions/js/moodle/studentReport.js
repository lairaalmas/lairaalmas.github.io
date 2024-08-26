/************************************************************************************
 * This code is used EXCLUSIVELY when iFractions is runnign inside Moodle via iAssign
 * as an iLM (interactive learning module) and the global variable moodle=true.
 *
 * This file holds game states.
 ************************************************************************************/

/**
 * [STUDENT REPORT STATE] Screen that shows the stats of a previously played game (exclusive to moodle).
 *
 * FOR MOODLE
 *
 * @namespace
 */
const studentReport = {
  /** FOR MOODLE
   * Main code
   */
  create: function () {
    const offsetX = context.canvas.width / 4;
    const offsetY = 37.5;

    const x0 = offsetX / 2;
    const y0 = context.canvas.height / 2 - 100;

    const titleFont = { ...textStyles.h1_, fill: colors.green };
    const infoFont = {
      ...textStyles.h4_,
      align: 'left',
      fill: colors.maroon,
    };

    renderBackground();

    // Title
    game.add.text(context.canvas.width / 2, 120, game.lang.results, titleFont);
    game.add.image(
      x0 - 80,
      y0 - 110,
      gameList[gameId].assets.menu.gameNameBtn,
      1.4
    );

    this.utils.renderCurGameMetadata(y0, offsetY, infoFont);
    this.utils.renderCurGameStats(x0, offsetX, offsetY, infoFont);
  },

  utils: {
    renderCurGameMetadata: function (defaultY, offsetY, font) {
      // Game info
      let text =
        game.lang[gameShape].charAt(0).toUpperCase() +
        game.lang[gameShape].slice(1);
      text =
        game.lang.game +
        ': ' +
        text +
        (gameName.slice(-3) == 'One' ? ' I' : ' II');

      const x0 = 360;

      game.add.text(x0, defaultY - offsetY * 2, text, font);
      game.add.text(
        x0,
        defaultY - offsetY,
        game.lang.game_mode + ': ' + gameMode.toUpperCase(),
        font
      );
      const operationText =
        gameOperation.charAt(0).toUpperCase() + gameOperation.slice(1);
      game.add.text(
        x0,
        defaultY,
        game.lang.operation + ': ' + operationText,
        font
      );
      game.add.text(
        x0,
        defaultY + offsetY,
        game.lang.difficulty + ': ' + gameDifficulty,
        font
      );
    },
    renderCurGameStats: function (defaultX, offsetX, offsetY, font) {
      // Student info
      const y0 = context.canvas.height - 300;
      let x = defaultX;

      for (let i = 0; i < 4; i++, x += offsetX) {
        // If level wasnt completed, show broken sign
        if (moodleVar.hits[i] === 0 && moodleVar.errors[i] === 0) {
          const sign = game.add.image(
            x,
            context.canvas.height - 150,
            'sign_broken',
            1.2
          );
          sign.anchor(0.5, 0.5);
          continue;
        }

        // If level was completed shows sign with level number and student report
        const sign = game.add.image(
          x,
          context.canvas.height - 150,
          'sign',
          1.2
        );
        sign.anchor(0.5, 0.5);

        const numberFont = {
          ...textStyles.h2_,
          font: 'bold ' + textStyles.h2_.font,
          fill: colors.white,
        };
        game.add.text(x, context.canvas.height - 150, '' + (i + 1), numberFont);

        game.add.geom.rect(
          x - 40 - 50,
          y0 - offsetY * 1.75,
          10,
          135 * 1.5,
          colors.blue,
          0.1
        );
        game.add.text(
          x - 60,
          y0 - offsetY,
          game.lang.time + ': ' + game.math.convertTime(moodleVar.time[i]),
          font
        );
        game.add.text(
          x - 60,
          y0,
          game.lang.hits + ': ' + moodleVar.hits[i],
          font
        );
        game.add.text(
          x - 60,
          y0 + offsetY,
          game.lang.errors + ': ' + moodleVar.errors[i],
          font
        );
      }
    },
  },
};
