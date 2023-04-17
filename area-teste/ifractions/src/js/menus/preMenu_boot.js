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
        case 'en':
          langString = 'en_US';
          break;
        case 'pt':
          langString = 'pt_BR';
          break;
        case 'fr':
          langString = 'fr_FR';
          break;
        case 'es':
          langString = 'es_PE';
          break;
        case 'it':
          langString = 'it_IT';
          break;
        default:
          langString = 'en_US';
      }
      game.load.lang('src/assets/lang/' + langString);
    }
    // LOADING MEDIA
    if (isDebugMode) {
      console.log(url.boot.audio.length + ' audio files to cache');
      console.log(url.boot.image.length + ' images to cache');
      console.log(url.boot.sprite.length + ' sprites to cache');
    }
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
  },
};
