/******************************
 * This file holds game states.
 ******************************/

/** [NAME STATE] Screen that asks for the user's name.
 *
 * @namespace
 */
const nameState = {
  /**
   * Main code
   */
  create: function () {
    renderBackground('plain');

    // Set title and warning text
    game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 - 150,
      game.lang.insert_name,
      { ...textStyles.h1_, fill: colors.green }
    );

    this.warningEmptyName = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 - 80,
      '',
      { ...textStyles.p_, fill: colors.red }
    );

    this.okBtn = game.add.geom.rect(
      context.canvas.width / 2,
      context.canvas.height / 2 + 93 + 44,
      300,
      100,
      colors.green
    );
    this.okBtn.anchor(0.5, 0.5);

    // Set button Text
    this.okBtnText = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 + 152, //112,
      game.lang.ready,
      textStyles.btn
    );

    // Makes text field visible
    document.querySelector('.ifr-input__container').style.visibility =
      'visible';

    // Does the same as the button click when the player presses 'enter'
    document
      .querySelector('.ifr-input')
      .addEventListener('keypress', function (e) {
        const keycode = e.key || e.code;
        if (keycode == 'Enter') {
          if (self.checkEmptyName()) self.saveName();
          game.render.all(); // Can show empty name
        }
      });

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);

    if (isDebugMode && debugState.name.skip) {
      // programmatically select a user name
      document.querySelector('.ifr-input').value =
        debugState.name.name || 'My User Name';
      this.saveName();
    }
  },

  /**
   * Checks if player entered name in text box
   *
   * @returns {boolean} false is textBox is emptys
   */
  checkEmptyName: function () {
    // If text field is empty displays error message
    if (document.querySelector('.ifr-input').value == '') {
      self.warningEmptyName.name = game.lang.empty_name;
      return false;
    }
    return true;
  },

  /**
   * Saves player name and calls next state
   */
  saveName: function () {
    // Saves player's input in global variable 'playerName'
    playerName = document.querySelector('.ifr-input').value;

    // Hides and clears text field
    document.querySelector('.ifr-input__container').style.visibility = 'hidden';
    document.querySelector('.ifr-input').value = '';

    if (audioStatus) game.audio.popSound.play();
    if (isDebugMode) console.log('Username: ' + playerName);

    // FOR MOODLE
    // Calls 'menu' state
    if (!moodle) game.state.start('menu');
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    const cur = self.okBtn;

    if (game.math.isOverIcon(x, y, cur)) {
      if (self.checkEmptyName()) {
        self.saveName();
      }
    }
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
    const cur = self.okBtn;

    if (game.math.isOverIcon(x, y, cur)) {
      document.body.style.cursor = 'pointer';
      cur.scale = 1.1;
      self.okBtnText.style = textStyles.btnLg;
    } else {
      document.body.style.cursor = 'auto';
      cur.scale = 1;
      self.okBtnText.style = textStyles.btn;
    }

    game.render.all();
  },
};
