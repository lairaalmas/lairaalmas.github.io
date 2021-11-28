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

    const offsetW = context.canvas.width / 4;
    let x = offsetW / 2;
    let y = context.canvas.height / 2 - 50;

    // Background
    game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, undefined, 0, colors.blueBckg, 1);
    game.add.image(640, 100, 'cloud');
    game.add.image(1280, 80, 'cloud');
    game.add.image(300, 85, 'cloud', 0.8);
    for (let i = 0; i < context.canvas.width / 100; i++) { game.add.image(i * 100, context.canvas.height - 100, 'floor'); }

    // Title
    game.add.text(context.canvas.width / 2, 80, game.lang.results, textStyles.h1_green);
    game.add.image(x - 40, y - 70, info.all[gameType].gameTypeUrl, 0.8);

    // Game info
    text = game.lang[gameShape].charAt(0).toUpperCase() + game.lang[gameShape].slice(1);
    text = game.lang.game + ': ' + text + ((gameType.slice(-3) == 'One') ? ' I' : ' II');
    game.add.text(190, y - 50, text, textStyles.h4_brown).align = 'left';
    game.add.text(190, y - 25, game.lang.game_mode + ': ' + gameMode, textStyles.h4_brown).align = 'left';
    game.add.text(190, y, game.lang.operation + ': ' + gameOperation, textStyles.h4_brown).align = 'left';
    game.add.text(190, y + 25, game.lang.difficulty + ': ' + gameDifficulty, textStyles.h4_brown).align = 'left';

    // Student info
    y = context.canvas.height - 200;
    for (let i = 0; i < 4; i++, x += offsetW) {
      // If level wasnt completed, show broken sign
      if (moodleVar.hits[i] == 0 && moodleVar.errors[i] == 0) {
        const sign = game.add.image(x, context.canvas.height - 100, 'broken_sign', 0.7);
        sign.anchor(0.5, 0.5);
      } else {
        // If level was completed shows sign with level number and student report
        const sign = game.add.image(x, context.canvas.height - 100, 'sign', 0.7);
        sign.anchor(0.5, 0.5);
        game.add.text(x, context.canvas.height - 100, '' + (i + 1), textStyles.h2_white);

        game.add.geom.rect(x - 55, y - 40, 5, 135, undefined, 0, colors.blueMenuLine);
        game.add.text(x - 40, y - 25, game.lang.time + ': ' + game.math.convertTime(moodleVar.time[i]), textStyles.h4_brown).align = 'left';
        game.add.text(x - 40, y, game.lang.hits + ': ' + moodleVar.hits[i], textStyles.h4_brown).align = 'left';
        game.add.text(x - 40, y + 25, game.lang.errors + ': ' + moodleVar.errors[i], textStyles.h4_brown).align = 'left';
      }
    }

  }

};