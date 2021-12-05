/**************************************************************
 * LInE - Free Education, Private Data - http://www.usp.br/line
 * 
 * This file holds all global elements to the game.
 * 
 * Generating game levels in menu:
 * ..................................................... 
 * ...............square....................circle...... }                   = gameShape
 * .........../...........\....................|........ } = gameType (game)
 * ........One.............Two................One....... }
 * ......./...\.........../...\............./....\...... 
 * ......A.....B.........A.....B...........A......B..... = gameMode (game mode)
 * .(floor)..(stack)..(top)..(bottom)..(floor)..(stack).
 * .......\./.............\./................\./........ 
 * ........|...............|..................|......... 
 * ......./.\..............|................/.|.\....... 
 * ...Plus...Minus.......Equals........Plus.Minus.Mixed. = gameOperation (game math operation)
 * .......\./..............|................\.|./....... 
 * ........|...............|..................|......... 
 * ......1,2,3.........1,2,3,4,5..........1,2,3,4,5..... = gameDifficulty (difficulty level)
 * ..................................................... 
 * 
 * About levels in map:
 * 
 * ..................(game.levels)......................
 * ......................__|__..........................
 * .....................|.|.|.|.........................
 * ...................0,1,2,3,4,5....................... = mapPosition (map positions)
 * ...................|.........|.......................
 * ................(start)....(end).....................
 **************************************************************/

/**
 * Turns console messages ON/OFF (for debug purposes only)
 * @type {boolean}
 */
const debugMode = false;

/** FOR MOODLE <br>
 * 
 * iFractions can run on a server or inside moodle through iAssign. <br>
 * This variable should be set according to where it is suposed to run: <br>
 * - if true, on moodle <br>
 * - if false, on a server
 */
const moodle = false;

/**
 * Name of the selected game.<br>
 * Can be: 'squareOne', 'squareTwo' or 'circleOne'.
 * 
 * @type {string}
 */
let gameType;

/**
 * Used for text and game information.<br>
 * Shape that makes the name of the game - e.g in 'squareOne' it is 'square'.<br>
 * Can be: 'circle' or 'square'.
 * 
 * @type {string}
 */
let gameShape;

/**
 * Holds selected game mode.<br>
 * In squareOne/circleOne   can be: 'A' (click on the floor) or 'B' (click on the amount to go/stacked figures).<br>
 * In squareTwo             can be: 'A' (more subdivisions on top) or 'B' (more subdivisions on bottom).
 * 
 * @type {string}
 */
let gameMode;

/**
 * Holds game math operation.<br>
 * In squareOne   can be: 'Plus' (green tractor goes right) or 'Minus' (red tractor goes left).<br>
 * In circleOne   can be: 'Plus' (green tractor goes right), 'Minus' (red tractor goes left) or 'Mixed' (green tractor goes both sides).<br>
 * In squareTwo   can be: 'Equals' (compares two rectangle subdivisions).
 * 
 * @type {string}
 */
let gameOperation;

/**
 * Holds game overall difficulty. 1 (easier) -> n (harder).<br> 
 * In squareOne             can be: 1..3.<br>
 * In circleOne/squareTwo   can be: 1..5.
 * 
 * @type {number}
 */
let gameDifficulty;

/**
 * Turns displaying the fraction labels on levels ON/OFF
 * @type {boolean}
 */
let fractionLabel = true;

/**
 * When true, the character can move to next position in the map
 * @type {boolean}
 */
let mapMove;

/**
 * Character position on the map, aka game levels (1..4: valid; 5: end)
 * @type {number}
 */
let mapPosition;

/**
 * Number of finished levels in the map
 * @type {number}
 */
let completedLevels;

/**
 * Turns game audio ON/OFF
 * @type {boolean}
 */
let audioStatus = false;

/**
 * Player's name
 * @type {string}
 */
let playerName;

/**
 * String that contains the selected language.<br>
 * It is the name of the language file.
 * @type {string}
 */
let langString;

/**
 * Holds the current state.<br>
 * Is used as if it was a 'this' inside state functions.
 * @type {object}
 */
let self;

const medSrc = 'assets/img/'; // Base directory for media

/**
 * Metadata for all games
 * @type {object}
 */
const info = {

  all: {

    squareOne: {
      gameShape: 'square',
      gameType: 'squareOne',
      gameTypeUrl: 'game0',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode0', 'mode1'],
      gameOperation: ['Plus', 'Minus'],
      gameOperationUrl: ['operation_plus', 'operation_minus'],
      gameDifficulty: 3
    },

    circleOne: {
      gameShape: 'circle',
      gameType: 'circleOne',
      gameTypeUrl: 'game1',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode2', 'mode3'],
      gameOperation: ['Plus', 'Minus', 'Mixed'],
      gameOperationUrl: ['operation_plus', 'operation_minus', 'operation_mixed'],
      gameDifficulty: 5
    },

    squareTwo: {
      gameShape: 'square',
      gameType: 'squareTwo',
      gameTypeUrl: 'game2',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode4', 'mode5'],
      gameOperation: ['Equals'],
      gameOperationUrl: ['operation_equals'],
      gameDifficulty: 5
    },

  },
  gameShape: [],
  gameType: [],
  gameTypeUrl: [],
  gameMode: [],
  gameModeUrl: [],
  gameOperation: [],
  gameOperationUrl: [],
  gameDifficulty: [],

};

// Called once when the game starts
(function () {
  for (key in info.all) {
    info.gameShape.push(info.all[key].gameShape);
    info.gameType.push(info.all[key].gameType);
    info.gameTypeUrl.push(info.all[key].gameTypeUrl);
    info.gameMode.push(info.all[key].gameMode);
    info.gameModeUrl.push(info.all[key].gameMode);
    info.gameOperation.push(info.all[key].gameOperation);
    info.gameOperationUrl.push(info.all[key].gameOperationUrl);
    info.gameDifficulty.push(info.all[key].gameDifficulty);
  }
})()

/**
 * Preset colors for graphic elements.
 * @type {object}
 */
const colors = {
  // Blues
  blueBckg: '#cce5ff', // Background color 
  blueBckgOff: '#adc8e6',
  blueBckgInsideLevel: '#a8c0e6', // Background color in squareOne (used for floor gap)
  blue: '#003cb3', // Subtitle
  blueMenuLine: '#b7cdf4',
  darkBlue: '#183780', // Line color that indicates right and fraction numbers

  // Reds
  red: '#b30000', // Linecolor that indicates left
  lightRed: '#d27979', // squareTwo figures
  darkRed: '#330000', // squareTwo figures and some titles

  // Greens
  green: '#00804d', // Title
  lightGreen: '#83afaf', // squareTwo figures
  darkGreen: '#1e2f2f', // squareTwo figures
  intenseGreen: '#00d600',

  // Basics
  white: '#efeff5',
  gray: '#708090',
  black: '#000',
  yellow: '#ffef1f'
};

/**
 * Preset text styles for game text.<br>
 * Contains: font, size, text color and text align.
 * @type {object} 
 */
const textStyles = {
  h1_green: { font: '32px Arial,sans-serif', fill: colors.green, align: 'center' }, // Menu title
  h2_green: { font: '26px Arial,sans-serif', fill: colors.green, align: 'center' }, // Flag labels (langState)

  h1_white: { font: '32px Arial,sans-serif', fill: colors.white, align: 'center' }, // Ok button (nameState)
  h2_white: { font: '26px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty buttons (menuState)
  h3__white: { font: '23px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty numbers (menuState)
  h4_white: { font: '20px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty numbers (menuState)
  p_white: { font: '14px Arial,sans-serif', fill: colors.white, align: 'center' }, // Enter button (menuState)

  h2_brown: { font: '26px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Map difficulty label
  h4_brown: { font: '20px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Menu overtitle
  p_brown: { font: '14px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Map difficulty label

  h2_blue_2: { font: '26px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h4_blue_2: { font: '20px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h2_blue: { font: '26px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  h4_blue: { font: '20px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  p_blue: { font: '14px Arial,sans-serif', fill: colors.darkBlue, align: 'center' } // Fractions
};

/**
 * List of URL for all media in the game
 * divided 1st by the 'state' that loads the media 
 * and 2nd by the 'media type' for that state.
 * 
 * @type {object}
 */
const url = {
  /** 
   * url.<state> 
   * where <state> can be: boot, menu, squareOne, squareTwo, circleOne. 
  */
  boot: {
    /**
     * url.<state>.<media type> 
     * where <media type> can be: image, sprite, audio <br><br>
     * 
     * image: [ [name, source], ... ] <br>
     * sprite: [ [name, source, number of frames], ... ] <br>
     * audio: [ [name, [source, alternative source] ], ... ]
     */
    image: [
      // Scene
      ['bgimage', medSrc + 'scene/bg.jpg'],
      ['bgmap', medSrc + 'scene/bg_map.png'],
      ['broken_sign', medSrc + 'scene/broken_sign.png'],
      ['bush', medSrc + 'scene/bush.png'],
      ['cloud', medSrc + 'scene/cloud.png'],
      ['floor', medSrc + 'scene/floor.png'],
      ['place_off', medSrc + 'scene/place_off.png'],
      ['place_on', medSrc + 'scene/place_on.png'],
      ['rock', medSrc + 'scene/rock.png'],
      ['road', medSrc + 'scene/road.png'],
      ['sign', medSrc + 'scene/sign.png'],
      ['tree1', medSrc + 'scene/tree.png'],
      ['tree2', medSrc + 'scene/tree2.png'],
      ['tree3', medSrc + 'scene/tree3.png'],
      ['tree4', medSrc + 'scene/tree4.png'],
      // Flags
      ['flag_BR', medSrc + 'flag/BRAZ.jpg'],
      ['flag_FR', medSrc + 'flag/FRAN.jpg'],
      ['flag_IT', medSrc + 'flag/ITAL.png'],
      ['flag_PE', medSrc + 'flag/PERU.jpg'],
      ['flag_US', medSrc + 'flag/UNST.jpg'],
      // Navigation icons on the top of the page
      ['back', medSrc + 'navig_icon/back.png'],
      ['help', medSrc + 'navig_icon/help.png'],
      ['home', medSrc + 'navig_icon/home.png'],
      ['language', medSrc + 'navig_icon/language.png'],
      ['menu', medSrc + 'navig_icon/menu.png'],
      // Interactive icons
      ['arrow_down', medSrc + 'interac_icon/down.png'],
      ['close', medSrc + 'interac_icon/close.png'],
      ['error', medSrc + 'interac_icon/error.png'],
      ['help_pointer', medSrc + 'interac_icon/pointer.png'],
      ['info', medSrc + 'interac_icon/info.png'],
      ['ok', medSrc + 'interac_icon/ok.png'],
      // Menu icons - Games
      ['game0', medSrc + 'levels/squareOne.png'], // Square I
      ['game1', medSrc + 'levels/circleOne.png'], // Circle I
      ['game2', medSrc + 'levels/squareTwo.png'], // Square II
      // Menu icons - Info box
      ['c1-A', medSrc + 'info_box/c1-A.png'],
      ['c1-A-h', medSrc + 'info_box/c1-A-h.png'],
      ['c1-B-h', medSrc + 'info_box/c1-B-h.png'],
      ['c1-diff-1', medSrc + 'info_box/c1-diff-1.png'],
      ['c1-diff-5', medSrc + 'info_box/c1-diff-5.png'],
      ['c1-label', medSrc + 'info_box/c1-label.png'],
      ['map-c1s2', medSrc + 'info_box/map-c1s2.png'],
      ['map-s1', medSrc + 'info_box/map-s1.png'],
      ['s1-A', medSrc + 'info_box/s1-A.png'],
      ['s1-A-h', medSrc + 'info_box/s1-A-h.png'],
      ['s1-B-h', medSrc + 'info_box/s1-B-h.png'],
      ['s1-diff-1', medSrc + 'info_box/s1-diff-1.png'],
      ['s1-diff-3', medSrc + 'info_box/s1-diff-3.png'],
      ['s1-label', medSrc + 'info_box/s1-label.png'],
      ['s2', medSrc + 'info_box/s2.png'],
      ['s2-A-h', medSrc + 'info_box/s2-A-h.png'],
      ['s2-B-h', medSrc + 'info_box/s2-B-h.png'],
      ['s2-diff-1', medSrc + 'info_box/s2-diff-1.png'],
      ['s2-diff-5', medSrc + 'info_box/s2-diff-5.png'],
      ['s2-label', medSrc + 'info_box/s2-label.png'],
      ['operation_plus', medSrc + 'info_box/operation_plus.png'],
      ['operation_minus', medSrc + 'info_box/operation_minus.png'],
      ['operation_mixed', medSrc + 'info_box/operation_mixed.png'],
      ['operation_equals', medSrc + 'info_box/operation_equals.png'],
    ],
    sprite: [
      // Game Sprites
      ['kid_walk', medSrc + 'character/kid/walk.png', 26],
      // Navigation icons on the top of the page
      ['audio', medSrc + 'navig_icon/audio.png', 2],
      // Interactive icons
      ['select', medSrc + 'interac_icon/selectionBox.png', 2],
      // Menu icons - Game modes
      ['mode0', medSrc + 'levels/squareOne_1.png', 2], // Square I : A
      ['mode1', medSrc + 'levels/squareOne_2.png', 2], // Square I : B
      ['mode2', medSrc + 'levels/circleOne_1.png', 2], // Circle I : A
      ['mode3', medSrc + 'levels/circleOne_2.png', 2], // Circle I : B
      ['mode4', medSrc + 'levels/squareTwo_1.png', 2], // Square II : A
      ['mode5', medSrc + 'levels/squareTwo_2.png', 2], // Square II : B
      // Menu icons - Math operations
      ['operation_plus', medSrc + 'levels/operation_plus.png', 2], // Square/circle I : right
      ['operation_minus', medSrc + 'levels/operation_minus.png', 2], // Square/circle I : left
      ['operation_mixed', medSrc + 'levels/operation_mixed.png', 2], // Circle I : mixed 
      ['operation_equals', medSrc + 'levels/operation_equals.png', 2], // Square II : equals
    ],
    audio: [
      // Sound effects
      ['beepSound', ['assets/audio/beep.ogg', 'assets/audio/beep.mp3']],
      ['okSound', ['assets/audio/ok.ogg', 'assets/audio/ok.mp3']],
      ['errorSound', ['assets/audio/error.ogg', 'assets/audio/error.mp3']]
    ]
  },
  squareOne: {
    image: [
      // Map buildings
      ['farm', medSrc + 'scene/farm.png'],
      ['garage', medSrc + 'scene/garage.png']
    ],
    sprite: [
      // Game sprites
      ['tractor', medSrc + 'character/tractor/tractor.png', 15]
    ],
    audio: []
  },
  squareTwo: {
    image: [
      // Map buildings
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png']
    ],
    sprite: [
      // Game sprites
      ['kid_standing', medSrc + 'character/kid/lost.png', 6],
      ['kid_run', medSrc + 'character/kid/run.png', 12]
    ],
    audio: []
  },
  circleOne: {
    image: [
      // Map buildings
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png'],
      // Game images
      ['balloon', medSrc + 'character/balloon/airballoon_upper.png'],
      ['balloon_basket', medSrc + 'character/balloon/airballoon_base.png']
    ],
    sprite: [
      // Game sprites
      ['kid_run', medSrc + 'character/kid/run.png', 12]
    ],
    audio: []
  },
};

/**
 * Manages navigation icons on the top of the screen
 * @namespace
 */
const navigationIcons = {

  /**
   * Add navigation icons.<br>
   *  * The icons on the left are ordered from left to right. <br>
   *  * The icons on the right are ordered from right to left.
   * 
   * @param {boolean} leftIcon0 1st left icon (back)
   * @param {boolean} leftIcon1 2nd left icon (main menu)
   * @param {boolean} leftIcon2 3rd left icon (solve game)
   * @param {boolean} rightIcon0 1st right icon (audio)
   * @param {boolean} rightIcon1 2nd right icon (lang)
   * @param {undefined|string} state state to be called by the 'back' button (must exist if param 'leftIcon0' is true)
   * @param {undefined|function} help function in the current game state that display correct answer
   */
  add: function (leftIcon0, leftIcon1, leftIcon2, rightIcon0, rightIcon1, state, help) {

    let left_x = 10;
    let right_x = context.canvas.width - 50 - 10;
    this.iconsList = [];

    // 'Descriptive labels' for the navigation icons
    this.left_text = game.add.text(left_x, 73, '', textStyles.h4_brown);
    this.left_text.align = 'left';

    this.right_text = game.add.text(right_x + 50, 73, '', textStyles.h4_brown);
    this.right_text.align = 'right';

    // Left icons

    if (leftIcon0) { // Return to previous screen
      if (!state) {
        console.error('Game error: You tried to add a \'back\' icon without the \'state\' parameter.');
      } else {
        this.state = state;
        this.iconsList.push(game.add.image(left_x, 10, 'back'));
        left_x += 50;
      }
    }

    if (leftIcon1) { // Return to main menu screen
      this.iconsList.push(game.add.image(left_x, 10, 'menu'));
      left_x += 50;
    }

    if (leftIcon2) { // Shows solution to the game
      if (!help) {
        console.error('Game error: You tried to add a \'game solution\' icon without the \'help\' parameter.');
      } else {
        this.help = help;
        this.iconsList.push(game.add.image(left_x, 10, 'help'));
        left_x += 50;
      }
    }

    // Right icons

    if (rightIcon0) { // Turns game audio on/off
      this.audioIcon = game.add.sprite(right_x, 10, 'audio', 1);
      this.audioIcon.curFrame = audioStatus ? 0 : 1;
      this.iconsList.push(this.audioIcon);
      right_x -= 50;
    }

    if (rightIcon1) { // Return to select language screen
      this.iconsList.push(game.add.image(right_x, 10, 'language'));
      right_x -= 50;
    }

  },

  /**
   * When 'back' icon is clicked go to this state
   * 
   * @param {string} state name of the next state
   */
  callState: function (state) {
    if (audioStatus) game.audio.beepSound.play();

    game.event.clear(self);
    game.state.start(state);
  },

  /**
   * Called by mouse click event 
   * 
   * @param {number} x contains the mouse x coordinate
   * @param {number} y contains the mouse y coordinate
   */
  onInputDown: function (x, y) {

    navigationIcons.iconsList.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        const name = cur.name;
        switch (name) {
          case 'back': navigationIcons.callState(navigationIcons.state); break;
          case 'menu': navigationIcons.callState('menu'); break;
          case 'help': navigationIcons.help(); break;
          case 'language': navigationIcons.callState('lang'); break;
          case 'audio':
            if (audioStatus) {
              audioStatus = false;
              navigationIcons.audioIcon.curFrame = 1;
            } else {
              audioStatus = true;
              if (audioStatus) game.audio.beepSound.play();
              navigationIcons.audioIcon.curFrame = 0;
            }
            game.render.all();
            break;
          default: console.error('Game error: error in navigation icon');
        }
      }
    });
  },

  /**
   * Called by mouse move event
   * 
   * @param {number} x contains the mouse x coordinate
   * @param {number} y contains the mouse y coordinate
   */
  onInputOver: function (x, y) {

    let flag = false;

    navigationIcons.iconsList.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        flag = true;
        let name = cur.name;
        switch (name) {
          case 'back': navigationIcons.left_text.name = game.lang.nav_back; break;
          case 'menu': navigationIcons.left_text.name = game.lang.nav_menu; break;
          case 'help': navigationIcons.left_text.name = game.lang.nav_help; break;
          case 'language': navigationIcons.right_text.name = game.lang.nav_lang; break;
          case 'audio': navigationIcons.right_text.name = game.lang.audio; break;
        }
      }
    });

    if (!flag) {
      navigationIcons.left_text.name = '';
      navigationIcons.right_text.name = '';
    } else {
      document.body.style.cursor = 'pointer';
    }
  }

};

/**
 * Sends game information to database
 *  
 * @param {string} extraData player information for the current game
 */
const sendToDB = function (extraData) {

  // FOR MOODLE
  if (moodle) {

    if (self.result) moodleVar.hits[mapPosition - 1]++;
    else moodleVar.errors[mapPosition - 1]++;

    moodleVar.time[mapPosition - 1] += game.timer.elapsed;

    const url = iLMparameters.iLM_PARAM_ServerToGetAnswerURL;
    const grade = '' + getEvaluation();
    const report = getAnswer();
    const data = 'return_get_answer=1' +
      '&iLM_PARAM_ActivityEvaluation=' + encodeURIComponent(grade) +
      '&iLM_PARAM_ArchiveContent=' + encodeURIComponent(report);

    const init = { method: 'POST', body: data, headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' } };

    fetch(url, init)
      .then(response => {
        if (response.ok) {
          if (debugMode) console.log("Processing...");
        } else {
          console.error("Game error: Network response was not ok.");
        }
      })
      .catch(error => {
        console.error('Game error: problem with fetch operation - ' + error.message + '.');
      });

  } else {

    // Create some variables we need to send to our PHP file
    // Attention: this names must be compactible to data table (MySQL server)
    // @see php/save.php
    const data = 'line_ip=143.107.45.11' // INSERT database server IP
      + '&line_name=' + playerName
      + '&line_lang=' + langString
      + extraData;

    const url = 'php/save.php';

    const init = { method: 'POST', body: data, headers: { 'Content-type': 'application/x-www-form-urlencoded' } };
    fetch(url, init)
      .then(response => {
        if (response.ok) {
          if (debugMode) console.log("Processing...");
          response.text().then(text => { if (debugMode) { console.log(text); } })
        } else {
          console.error("Game error: Network response was not ok.");
        }
      })
      .catch(error => {
        console.error('Game error: problem with fetch operation - ' + error.message + '.');
      });
  }

};

let gameFrame = function () {
  let x = y = 200;
  let width = context.canvas.width - 2 * x;
  let height = context.canvas.height - 2 * y;
  let rect = function () { game.add.geom.rect(x, y, width, height, colors.red, 2) }
  let point = function (offsetW, offsetH) {
    for (let i = 0, y1 = y; i < 4; i++) {
      x1 = x;
      for (let j = 0; j < 7; j++) {
        game.add.geom.rect(x1, y1, 20, 20, undefined, 0, colors.red, 1);
        x1 += offsetW;
      }
      y1 += offsetH;
    }
  }
  return { x, y, width, height, rect, point}
}