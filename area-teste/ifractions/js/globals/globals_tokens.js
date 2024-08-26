const baseUrl = './assets/img/'; // Base directory for media
const fallbackImgUrl = './assets/img/fallback.png';

/**
 * Preset colors for graphic elements.
 * @type {object}
 */
const colors = {
  // Blues
  blueDark: '#02277d', // Line color that indicates right and fraction numbers
  blue: '#003cb3', // Subtitle
  blueLight: '#92b3e8', //'#a4c6fc',

  blueBg: '#cce5ff', // Background color
  blueBgInsideLevel: '#a8c0e6', // Background color in squareOne (used for floor gap)

  blueMenuLine: '#b7cdf4',

  // Reds
  redLight: '#d27979', // squareTwo figures
  red: '#b30000', // Linecolor that indicates left
  redDark: '#730101', // squareTwo figures and some titles

  maroon: '#330000', // squareTwo figures and some titles

  // Greens
  greenLight: '#79d2a1', // squareTwo figures
  green: '#00804d', // Title
  greenDark: '#005231', // squareTwo figures

  // Basics
  white: '#fff',
  gray: '#1f1f1f',
  black: '#000',
};

const font = {
  sizes: {
    h1: '48px',
    h2: '42px',
    h3: '38px',
    h4: '36px',
    p: '30px',
    display: '62px',
  },
  families: {
    default: 'Arial, sans-serif',
    btn: 'Arial, sans-serif',
    fraction: 'monospace',
  },
};

/**
 * Preset text styles for game text.<br>
 * Contains: font, size, text color and text align.
 * @type {object}
 */
const textStyles = {
  h1_: {
    font: `${font.sizes.h1} ${font.families.default}`,
    align: 'center',
    fill: colors.blue,
  },
  h2_: {
    font: `${font.sizes.h2} ${font.families.default}`,
    align: 'center',
    fill: colors.blue,
  },
  h3_: {
    font: `${font.sizes.h3} ${font.families.default}`,
    align: 'center',
    fill: colors.blue,
  },
  h4_: {
    font: `${font.sizes.h4} ${font.families.default}`,
    align: 'center',
    fill: colors.blue,
  },
  p_: {
    font: `${font.sizes.p} ${font.families.default}`,
    align: 'center',
    fill: colors.maroon,
  },
  btn: {
    font: `${font.sizes.h2} ${font.families.btn}`,
    align: 'center',
    fill: colors.white,
    increaseLetterSpacing: true,
  },
  btnLg: {
    font: `${font.sizes.h1} ${font.families.btn}`,
    align: 'center',
    fill: colors.white,
    increaseLetterSpacing: true,
  },
  fraction: {
    font: `${font.sizes.display} ${font.families.fraction}`,
    align: 'left',
    fill: colors.blue,
  },
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
      ['fallback', fallbackImgUrl],
      // scene new level
      ['floor_stone_left', baseUrl + 'scene/new_level/floor_stone_left.png'],
      ['floor_stone_right', baseUrl + 'scene/new_level/floor_stone_right.png'],
      ['floor_stone', baseUrl + 'scene/new_level/floor_stone.png'],
      ['wood_shelf', baseUrl + 'scene/new_level/wood_shelf.png'],
      ['bg_snow', baseUrl + 'scene/new_level/bg_snow.png'],
      // Scene
      ['bg_default', baseUrl + 'scene/bg_default.jpg'],
      ['bg_map', baseUrl + 'scene/bg_map.png'],
      ['bush', baseUrl + 'scene/bush.png'],
      ['cloud', baseUrl + 'scene/cloud.png'],
      ['floor_grass', baseUrl + 'scene/floor_grass.png'],
      ['floor_road', baseUrl + 'scene/floor_road.png'],
      ['rock', baseUrl + 'scene/rock.png'],
      ['progress_bar_tile', baseUrl + 'scene/progress_bar_tile.png'],
      ['sign', baseUrl + 'scene/sign.png'],
      ['sign_broken', baseUrl + 'scene/sign_broken.png'],
      ['tree_1', baseUrl + 'scene/tree_1.png'],
      ['tree_2', baseUrl + 'scene/tree_2.png'],
      ['tree_3', baseUrl + 'scene/tree_3.png'],
      ['tree_4', baseUrl + 'scene/tree_4.png'],
      // Flags
      ['flag_BR', baseUrl + 'flags/br.png'],
      ['flag_FR', baseUrl + 'flags/fr.png'],
      ['flag_IT', baseUrl + 'flags/it.png'],
      ['flag_ES', baseUrl + 'flags/es.png'],
      ['flag_US', baseUrl + 'flags/us.png'],
      // Navigation icons on the top of the page
      ['back', baseUrl + 'icons_navigation/back.png'],
      ['show_answer', baseUrl + 'icons_navigation/show_solution.png'],
      ['home', baseUrl + 'icons_navigation/home.png'],
      ['lang', baseUrl + 'icons_navigation/language.png'],
      ['menu', baseUrl + 'icons_navigation/menu.png'],
      // Interactive icons
      ['answer_correct', baseUrl + 'icons_interactive/answer_correct.png'],
      ['answer_wrong', baseUrl + 'icons_interactive/answer_wrong.png'],
      ['arrow_down', baseUrl + 'icons_interactive/arrow_down.png'],
      // ['close', baseUrl + 'icons_interactive/close.png'],
      ['info', baseUrl + 'icons_interactive/info.png'],
      ['pointer', baseUrl + 'icons_interactive/pointer.png'],
      // Menu icons - Games
      ['game_0', baseUrl + 'icons_menu/squareOne.png'], // Square I
      ['game_1', baseUrl + 'icons_menu/circleOne.png'], // Circle I
      ['game_2', baseUrl + 'icons_menu/squareTwo.png'], // Square II
      ['game_3', baseUrl + 'icons_menu/scaleOne.png'], // Scale I
      // Menu icons - Info box
      ['c1-A', baseUrl + 'info_box/c1-A.png'],
      ['c1-A-h', baseUrl + 'info_box/c1-A-h.png'],
      ['c1-B-h', baseUrl + 'info_box/c1-B-h.png'],
      ['c1-diff-1', baseUrl + 'info_box/c1-diff-1.png'],
      ['c1-diff-5', baseUrl + 'info_box/c1-diff-5.png'],
      ['c1-label', baseUrl + 'info_box/c1-label.png'],
      ['map-c1s2', baseUrl + 'info_box/map-c1s2.png'],
      ['map-s1', baseUrl + 'info_box/map-s1.png'],
      ['s1-A', baseUrl + 'info_box/s1-A.png'],
      ['s1-A-h', baseUrl + 'info_box/s1-A-h.png'],
      ['s1-B-h', baseUrl + 'info_box/s1-B-h.png'],
      ['s1-diff-1', baseUrl + 'info_box/s1-diff-1.png'],
      ['s1-diff-3', baseUrl + 'info_box/s1-diff-3.png'],
      ['s1-label', baseUrl + 'info_box/s1-label.png'],
      ['s2', baseUrl + 'info_box/s2.png'],
      ['s2-A-h', baseUrl + 'info_box/s2-A-h.png'],
      ['s2-B-h', baseUrl + 'info_box/s2-B-h.png'],
      ['s2-diff-1', baseUrl + 'info_box/s2-diff-1.png'],
      ['s2-diff-5', baseUrl + 'info_box/s2-diff-5.png'],
      ['s2-label', baseUrl + 'info_box/s2-label.png'],
      ['op_plus', baseUrl + 'info_box/op_plus.png'],
      ['op_min', baseUrl + 'info_box/op_min.png'],
      ['op_mix', baseUrl + 'info_box/op_mix.png'],
      ['op_eq', baseUrl + 'info_box/op_eq.png'],
    ],
    sprite: [
      // scene
      ['map_place', baseUrl + 'scene/map_place.png', 2],
      // Game Sprites
      ['kid_walking', baseUrl + 'characters/kid/walking.png', 26],
      // Navigation icons on the top of the page
      ['audio', baseUrl + 'icons_navigation/audio.png', 2],
      // Interactive icons
      ['select_input', baseUrl + 'icons_interactive/select_input.png', 2],
      ['btn_square', baseUrl + 'icons_interactive/btn_square.png', 2],
      // Menu icons - Game modes
      ['mode_0', baseUrl + 'icons_menu/squareOne_1.png', 2], // Square I : A
      ['mode_1', baseUrl + 'icons_menu/squareOne_2.png', 2], // Square I : B
      ['mode_2', baseUrl + 'icons_menu/circleOne_1.png', 2], // Circle I : A
      ['mode_3', baseUrl + 'icons_menu/circleOne_2.png', 2], // Circle I : B
      ['mode_4', baseUrl + 'icons_menu/squareTwo_1.png', 2], // Square II : A
      ['mode_5', baseUrl + 'icons_menu/squareTwo_2.png', 2], // Square II : B
      ['mode_6', baseUrl + 'icons_menu/scaleOne_1.png', 2], // Scale I : A
      // Menu icons - Math operations
      ['operation_plus', baseUrl + 'icons_menu/operation_plus.png', 2],
      ['operation_minus', baseUrl + 'icons_menu/operation_minus.png', 2],
      ['operation_mixed', baseUrl + 'icons_menu/operation_mixed.png', 2],
      ['operation_equals', baseUrl + 'icons_menu/operation_equals.png', 2],
    ],
    audio: [
      // Sound effects
      ['beepSound', ['./assets/audio/beep.ogg', './assets/audio/beep.mp3']],
      ['okSound', ['./assets/audio/ok.ogg', './assets/audio/ok.mp3']],
      ['errorSound', ['./assets/audio/error.ogg', './assets/audio/error.mp3']],
      ['popSound', ['', './assets/audio/pop.wav']],
    ],
  },
  squareOne: {
    image: [
      // Map buildings
      ['farm', baseUrl + 'scene/building_farm.png'],
      ['garage', baseUrl + 'scene/building_garage.png'],
    ],
    sprite: [
      // Game sprites
      ['tractor', baseUrl + 'characters/tractor/tractor.png', 15],
    ],
    audio: [],
  },
  squareTwo: {
    image: [
      // Map buildings
      ['house', baseUrl + 'scene/building_house.png'],
      ['school', baseUrl + 'scene/building_school.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_standing', baseUrl + 'characters/kid/lost.png', 6],
      ['kid_running', baseUrl + 'characters/kid/running.png', 12],
    ],
    audio: [],
  },
  circleOne: {
    image: [
      // Map buildings
      ['house', baseUrl + 'scene/building_house.png'],
      ['school', baseUrl + 'scene/building_school.png'],
      // Game images
      ['balloon', baseUrl + 'characters/balloon/balloon.png'],
      ['balloon_basket', baseUrl + 'characters/balloon/balloon_basket.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_running', baseUrl + 'characters/kid/running.png', 12],
    ],
    audio: [],
  },
  scaleOne: {
    image: [
      // Map buildings
      ['farm', baseUrl + 'scene/building_farm.png'],
      ['garage', baseUrl + 'scene/building_garage.png'],
      // Game images
      ['scale_base', baseUrl + 'characters/scale/scale_base.png'],
      ['scale_arm', baseUrl + 'characters/scale/scale_arm.png'],
      ['scale_plate', baseUrl + 'characters/scale/scale_plate.png'],
    ],
    sprite: [
      // Map buildings
      ['tractor', baseUrl + 'characters/tractor/tractor.png', 15],
      ['floor_snow', baseUrl + 'scene/new_level/floor_snow.png', 9],
    ],
    audio: [],
  },
};
