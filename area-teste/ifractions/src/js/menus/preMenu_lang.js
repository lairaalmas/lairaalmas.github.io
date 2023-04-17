/******************************
 * This file holds game states.
 ******************************/

/** [LANGUAGE STATE] Screen that asks the user to select the language for the game text.
 *
 * @namespace
 */
const langState = {
  /**
   * Main code
   */
  create: function () {
    renderBackground('plain');

    // Parameters for the elements on the screen
    this.listOfFlags = [];

    this.langs = {
      text: [
        'FRAÇÕES  ',
        'FRACCIONES  ',
        'FRACTIONS  ',
        'FRACTIONS  ',
        'FRAZIONI  ',
      ], // Language names
      flag: ['flag_BR', 'flag_PE', 'flag_FR', 'flag_US', 'flag_IT'], // Icon names
      lang: ['pt_BR', 'es_PE', 'fr_FR', 'en_US', 'it_IT'], // Parameters sent for language object
      x: [-350, -350, -350, 250, 250],
      y: [-220, 0, 220, -110, 110],
    };

    // Create elements on screen
    for (let i in this.langs.flag) {
      // Add text for language names
      game.add.text(
        context.canvas.width / 2 + this.langs.x[i],
        context.canvas.height / 2 + this.langs.y[i],
        this.langs.text[i],
        { ...textStyles.h2_, fill: colors.green }
      ).align = 'right';

      // Add icons for flags
      const flag = game.add.image(
        context.canvas.width / 2 + this.langs.x[i] + 100,
        context.canvas.height / 2 + this.langs.y[i] - 13,
        this.langs.flag[i]
      );
      flag.anchor(0.5, 0.5);
      this.listOfFlags.push(flag);
    }

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);

    if (isDebugMode && debugState.lang.skip) {
      // programmatically select a language
      this.setLang(debugState.lang.lang || 'pt_BR');
    }
  },

  /**
   * Calls state that loads selected language
   *
   * @param {string} selectedLang language selected by player
   */
  setLang: function (selectedLang) {
    // Saves language name e.g 'pt_BR'
    langString = selectedLang;
    if (audioStatus) game.audio.popSound.play();
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

    self.listOfFlags.forEach((cur) => {
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

    self.listOfFlags.forEach((cur) => {
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
  },
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
    game.load.lang('src/assets/lang/' + langString);
  },

  /**
   * Main code
   */
  create: function () {
    if (isDebugMode) console.log('Language: ' + langString);

    // Make sure to only ask for player name on the first time oppening the game
    if (this.firstTime == undefined) {
      this.firstTime = false;
      game.state.start('name'); // First time opening ifractions ('lang' >> 'name' >> 'menu')
    } else {
      game.state.start('menu'); // If changing language during the game ('lang' >> >> 'menu')
    }
  },
};
