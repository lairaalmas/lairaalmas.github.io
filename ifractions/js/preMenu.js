/******************************
 * This file holds game states.
 ******************************/

/** [BOOT STATE] First state called. Loads media. <br>
 * 
 * @namespace
 */
const bootState = {

  /**
   * Preloads media for current state
   */
  preload: function () {
    // FOR MOODLE
    if (moodle) {
      loadLangState.firstTime = false;
      const moodleLang = iLMparameters.lang;
      switch (moodleLang) {
        case 'en': langString = 'en_US'; break;
        case 'pt': langString = 'pt_BR'; break;
        case 'fr': langString = 'fr_FR'; break;
        case 'es': langString = 'es_PE'; break;
        case 'it': langString = 'it_IT'; break;
        default: langString = 'en_US';
      }
      game.load.lang('assets/lang/' + langString);
    }
    // LOADING MEDIA
    game.load.audio(url.boot.audio);
    game.load.image(url.boot.image);
    game.load.sprite(url.boot.sprite);
  },

  /**
   * Main code
   */
  create: function () {

    // Calls first screen seen by the player

    // FOR MOODLE
    if (moodle) {
      game.state.start('menu');
    } else {
      game.state.start('lang');
    }
  }

};

/** [LANGUAGE STATE] Screen that asks the user to select the language for the game text.
 * 
 * @namespace
 */
const langState = {

  /**
   * Main code
   */
  create: function () {
    // Background color
    game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, colors.white, 0, colors.blueBckg, 1);

    // Parameters for the elements on the screen
    this.listOfFlags = [];

    this.langs = {
      text: ['FRAÇÕES  ', 'FRAZIONI  ', 'FRACTIONS  ', 'FRACCIONES  ', 'FRACTIONS  '], // Language names
      flag: ['flag_BR', 'flag_IT', 'flag_US', 'flag_PE', 'flag_FR'], // Icon names
      lang: ['pt_BR', 'it_IT', 'en_US', 'es_PE', 'fr_FR'], // Parameters sent for language object
      x: [-220, -220, -220, 200, 200],
      y: [-180, 0, 180, -100, 100]
    };

    // Create elements on screen  
    for (let i in this.langs.flag) {
      // Add text for language names
      game.add.text(context.canvas.width / 2 + this.langs.x[i], context.canvas.height / 2 + this.langs.y[i], this.langs.text[i], textStyles.h2_green).align = 'right';

      // Add icons for flags
      const flag = game.add.image(context.canvas.width / 2 + this.langs.x[i] + 100, context.canvas.height / 2 + this.langs.y[i], this.langs.flag[i]);
      flag.anchor(0.5, 0.5);

      this.listOfFlags.push(flag);
    }

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Calls state that loads selected language
   * 
   * @param {string} selectedLang language selected by player
   */
  setLang: function (selectedLang) {
    // Saves language name e.g 'pt_BR'
    langString = selectedLang;
    // Calls loading screen
    game.state.start('loadLang');
  },

  /**
 * Called by mouse click event
 * 
 * @param {object} mouseEvent contains the mouse click coordinates
 */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
   
    self.listOfFlags.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        for (let i in self.langs.flag) {
          if (self.langs.flag[i] == cur.name) {
            self.setLang(self.langs.lang[i]);
            break;
          }
        }
      }
    });
  },

  /**
   * Called by mouse move event
   * 
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let flag = false;
    
    self.listOfFlags.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        flag = true;
        cur.scale = cur.scale = 1.05;
      } else {
        cur.scale = cur.scale = 1;
      }
    });

    if (flag) document.body.style.cursor = 'pointer';
    else document.body.style.cursor = 'auto';

    game.render.all();
  }

};

/** [LOADING LANGUAGE STATE] Loads the selected language.
 * 
 *  @namespace
 */
const loadLangState = {

  /**
   * Preloads media for current state
   */
  preload: function () {
    // LOADING MEDIA : selected language
    game.load.lang('assets/lang/' + langString);
  },

  /**
   * Main code
   */
  create: function () {
    if (debugMode) console.log('Language: ' + langString);

    // Make sure to only ask for player name on the first time oppening the game
    if (this.firstTime == undefined) {
      this.firstTime = false;
      game.state.start('name'); // First time opening ifractions ('language' >> 'name' >> 'menu')
    } else {
      game.state.start('menu'); // If changing language during the game ('language' >> >> 'menu')         
    }
  }

};

/** [NAME STATE] Screen that asks for the user's name.
 * 
 * @namespace
 */
const nameState = {

  /**
   * Main code
   */
  create: function () {

    // Background color
    game.add.geom.rect(0, 0, context.canvas.width, context.canvas.height, colors.white, 0, colors.blueBckg, 1);

    // Set title and warning text

    game.add.text(context.canvas.width / 2, context.canvas.height / 2 - 100, game.lang.insert_name, textStyles.h1_green);

    this.warningEmptyName = game.add.text(context.canvas.width / 2, context.canvas.height / 2 - 70, '', textStyles.h4_brown);

    // Set 'ok' button that gets player's information
    this.okBtn = game.add.geom.rect(context.canvas.width / 2 - 84, context.canvas.height / 2 + 70, 168, 60, undefined, 0, colors.gray, 0.6);

    // Set button Text
    game.add.text(context.canvas.width / 2 + 1, context.canvas.height / 2 + 112, game.lang.ready, textStyles.h1_white);

    // Makes text field visible
    document.getElementById('textbox').style.visibility = 'visible';

    // Does the same as the button click when the player presses 'enter'
    document.getElementById('textbox-content').addEventListener('keypress', function (e) {
      const keycode = e.key || e.code;
      if (keycode == 'Enter') {
        if (self.checkEmptyName()) self.saveName();
        game.render.all(); // Can show empty name
      }
    });

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);

  },

  /**
   * Checks if player entered name in text box
   * 
   * @returns {boolean} false is textBox is emptys
   */
  checkEmptyName: function () {
    // If text field is empty displays error message
    if (document.getElementById('textbox-content').value == '') {
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
    playerName = document.getElementById('textbox-content').value;

    // Hides and clears text field
    document.getElementById('textbox').style.visibility = 'hidden';
    document.getElementById('textbox-content').value = '';

    if (audioStatus) game.audio.beepSound.play();
    if (debugMode) console.log('Username: ' + playerName);

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
      cur.alpha = 0.4;
    } else {
      document.body.style.cursor = 'auto';
      cur.alpha = 0.6;
    }

    game.render.all();
  }

};