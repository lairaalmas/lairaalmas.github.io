/**************************************************************
 * LInE - Free Education, Private Data - http://www.usp.br/line
 *
 * This file holds all global elements to the game.
 *
 * Generating game levels in menu:
 * .....................................................
 * ...............square....................circle...... }                   = gameShape
 * .........../...........\....................|........ } = gameName (game)
 * ........One.............Two................One....... }
 * ......./...\.........../...\............./....\......
 * ......a.....b.........a.....b...........a......b..... = gameMode (game mode)
 * .(floor)..(stack)..(top)..(bottom)..(floor)..(stack).
 * .......\./.............\./................\./........
 * ........|...............|..................|.........
 * ......./.\..............|................/.|.\.......
 * ...plus...minus.......minus........plus.minus.mixed. = gameOperation (game math operation)
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
 * ...................0,1,2,3,4,5....................... = curMapPosition (map positions)
 * ...................|.........|.......................
 * ................(start)....(end).....................
 **************************************************************/

/** FOR MOODLE <br>
 *
 * iFractions can run on a server or inside moodle through iAssign. <br>
 * This variable should be set according to where it is suposed to run: <br>
 * - if true, on moodle <br>
 * - if false, on a server
 */
const moodle = false;

let moodleVar;

/**
 * Index of the current game in gameList array
 *
 * @type {number}
 */
let gameId;

/**
 * Selected game name.<br>
 * Can be: 'squareOne', 'squareTwo' or 'circleOne'.
 *
 * @type {string}
 */
let gameName;

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
 * In squareOne/circleOne   can be: 'a' (click on the floor) or 'b' (click on the amount to go/stacked figures).<br>
 * In squareTwo             can be: 'a' (more subdivisions on top) or 'b' (more subdivisions on bottom).
 *
 * @type {string}
 */
let gameMode;

/**
 * Holds game math operation.<br>
 * In squareOne   can be: 'plus' (green tractor goes right) or 'minus' (red tractor goes left).<br>
 * In circleOne   can be: 'plus' (green tractor goes right), 'minus' (red tractor goes left) or 'mixed' (green tractor goes both sides).<br>
 * In squareTwo   can be: 'minus' (compares two rectangle subdivisions).
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
let showFractions = true;

/**
 * When true, the character can move to next position in the map
 * @type {boolean}
 */
let canGoToNextMapPosition;

/**
 * Character position on the map, aka game levels (1..4: valid; 5: end)
 * @type {number}
 */
let curMapPosition;

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

/**
 * Information for all the games
 * @type {Array}
 */
const gameList = [
  {
    gameName: 'squareOne',
    gameMode: ['a', 'b'],
    gameOperation: ['plus', 'minus'],
    gameDifficulty: 3,
    gameShape: 'square',
    assets: {
      menu: {
        gameNameBtn: 'game_0',
        infoBox: () => ({
          title: `<strong>${game.lang.game}:</strong> ${game.lang.square} I`,
          body: `<ul>${game.lang.infoBox_squareOne}</ul>`,
          img: `<img class="ifr-infoBox__menu__img" src="${game.image['s1-A'].src}">`,
        }),
      },
      customMenu: {
        gameModeBtn: ['mode_0', 'mode_1'],
        gameOperationBtn: ['operation_plus', 'operation_minus'],
        auxiliarTitle: (x, y, offsetW, offsetH) => {
          game.add.text(
            x + 5 * offsetW,
            y + offsetH + 50,
            game.lang.show,
            textStyles.h4_
          );
          game.add.text(
            x + 5 * offsetW,
            y + offsetH + 80,
            game.lang.title,
            textStyles.h2_
          );
        },
        infoBox: () => ({
          gameMode: {
            title: game.lang.game_modes,
            body: `<p>${game.lang.infoBox_mode}</p>`,
            img: `<table>
              <tr>
                <td><b>${game.lang.mode}: A</b> - ${game.lang.infoBox_mode_s1_A}</td> 
                <td><b>${game.lang.mode}: B</b> - ${game.lang.infoBox_mode_s1_B}</td>
              </tr>
              <tr>
                <td><img width=100% src="${game.image['s1-A-h'].src}"></td>
                <td><img width=100% src="${game.image['s1-B-h'].src}"></td>
              </tr>
          <table>`,
          },
          gameDifficulty: {
            title: game.lang.difficulties,
            body: `<p>${game.lang.infoBox_diff}</p><p>${game.lang.infoBox_diff_obs}</p>`,
            img: `<table>
              <tr>
                <td><b>${game.lang.difficulty}:</b> 1</td>
                <td><b>${game.lang.difficulty}:</b> 3</td>
              </tr>
              <tr> 
                <td><img width=100% src="${game.image['s1-diff-1'].src}"></td>
                <td style="border-left: 4px solid white"><img width=100% src="${game.image['s1-diff-3'].src}"></td>
              </tr>
            </table>
            <br>
            ${game.lang.infoBox_diff_aux}
            <div><img width=50% src="${game.image['map-s1'].src}"></div>`,
          },
          gameMisc: {
            title: `${game.lang.show} ${self.auxText}`,
            body: game.lang.infoBox_misc_label,
            img: `<img class="mx-auto" width=80% src="${game.image['s1-label'].src}">`,
          },
        }),
      },
      map: {
        characterAnimation: (operation) => {
          return operation === 'plus'
            ? ['move', [0, 1, 2, 3, 4], 3]
            : ['move', [10, 11, 12, 13, 14], 3];
        },
        character: (operation) => {
          let char;
          if (operation == 'plus') {
            char = game.add.sprite(
              self.scene.roadPoints.x[curMapPosition],
              self.scene.roadPoints.y[curMapPosition],
              'tractor',
              0,
              0.75
            );
          }
          if (operation === 'minus') {
            char = game.add.sprite(
              self.scene.roadPoints.x[curMapPosition],
              self.scene.roadPoints.y[curMapPosition],
              'tractor',
              10,
              0.75
            );
          }
          char.rotate = -30; // 25 counterclockwise
          char.anchor(0.25, 0.5);
          return char;
        },
        startBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[0] - 60,
            self.scene.roadPoints.y[0] - 155,
            'garage',
            0.6
          );
        },
        endBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[5] - 10,
            self.scene.roadPoints.y[5] - 215,
            'farm',
            0.9
          );
        },
      },
      end: {
        characterAnimation: () =>
          gameOperation === 'plus'
            ? ['move', [0, 1, 2, 3, 4], 3]
            : ['move', [10, 11, 12, 13, 14], 3],
        character: () => {
          const char = game.add.sprite(
            0,
            context.canvas.height - 170 - 80,
            'tractor',
            0,
            1.05
          );
          char.anchor(0.5, 0.5);
          if (gameOperation === 'minus') char.curFrame = 10;

          return char;
        },
        building: () =>
          game.add
            .image(
              context.canvas.width - 420,
              context.canvas.height - 100,
              'farm',
              1.7
            )
            .anchor(0, 1),
      },
    },
  },
  {
    gameName: 'circleOne',
    gameMode: ['a', 'b'],
    gameOperation: ['plus', 'minus', 'mixed'],
    gameDifficulty: 5,
    // info
    gameShape: 'circle',
    assets: {
      menu: {
        gameNameBtn: 'game_1',
        infoBox: () => ({
          title: `<strong>${game.lang.game}:</strong> ${game.lang.circle} I`,
          body: `<ul>${game.lang.infoBox_circleOne}</ul>`,
          img: `<img class="mx-auto" width=60% src="${game.image['c1-A'].src}">`,
        }),
      },
      customMenu: {
        gameModeBtn: ['mode_2', 'mode_3'],
        gameOperationBtn: [
          'operation_plus',
          'operation_minus',
          'operation_mixed',
        ],
        auxiliarTitle: (x, y, offsetW, offsetH) => {
          game.add.text(
            x + 5 * offsetW,
            y + offsetH + 50,
            game.lang.show,
            textStyles.h4_
          );
          game.add.text(
            x + 5 * offsetW,
            y + offsetH + 80,
            game.lang.title,
            textStyles.h2_
          );
        },
        infoBox: () => ({
          gameMode: {
            title: game.lang.game_modes,
            body: `<p>${game.lang.infoBox_mode}</p>`,
            img: `<table>
            <tr style="border-bottom: 5px solid white">
              <td width=70%>
                <img width=100% src=${game.image['c1-A-h'].src}>
              </td>
              <td>&nbsp;<b>${game.lang.mode}: A</b> - ${game.lang.infoBox_mode_c1_A}</td>
            </tr>
            <tr>
              <td><img width=100% src=${game.image['c1-B-h'].src}></td>
              <td>&nbsp;<b>${game.lang.mode}: B</b> - ${game.lang.infoBox_mode_c1_B}</td>
            </tr>
          </table>`,
          },
          gameDifficulty: {
            title: game.lang.difficulties,
            body: `<p>${game.lang.infoBox_diff}</p><p>${game.lang.infoBox_diff_obs}</p>`,
            img: `<table>
            <tr>
              <td style="border-right: 4px solid white">
                <b>${game.lang.difficulty}:</b> 1
              </td>
              <td>
                <b>${game.lang.difficulty}:</b> 5
              </td>
            </tr>
            <tr>
              <td>
                <img width=100% src="${game.image['c1-diff-1'].src}">
              </td>
              <td style="border-left: 4px solid white">
                <img width=100% src="${game.image['c1-diff-5'].src}">
              </td>
            </tr>
          </table>
          <br>
          ${game.lang.infoBox_diff_aux}
          <div><img width=50% src="${game.image['map-c1s2'].src}"></div>`,
          },
          gameMisc: {
            title: `${game.lang.show} ${self.auxText}`,
            body: game.lang.infoBox_misc_label,
            img: `<img class="mx-auto" width=60% src="${game.image['c1-label'].src}">`,
          },
        }),
      },
      map: {
        characterAnimation: (operation) => {
          return ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
        },
        character: (operation) => {
          const char = game.add.sprite(
            self.scene.roadPoints.x[curMapPosition],
            self.scene.roadPoints.y[curMapPosition],
            'kid_running',
            0,
            0.57
          );
          char.anchor(0, 0.85);
          return char;
        },
        startBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[0] - 193,
            self.scene.roadPoints.y[0] - 205,
            'house',
            1.03
          );
        },
        endBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[5] - 28,
            self.scene.roadPoints.y[5] - 215,
            'school',
            0.52
          );
        },
      },
      end: {
        characterAnimation: () => [
          'move',
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          3,
        ],
        character: () => {
          const char = game.add.sprite(0, -152, 'kid_running', 0, 1.05);
          char.anchor(0.5, 0.5);
          return char;
        },
        building: () =>
          game.add
            .image(
              context.canvas.width - 620,
              context.canvas.height - 20 - 15,
              'school',
              1.3
            )
            .anchor(0, 1),
      },
    },
  },
  {
    gameName: 'squareTwo',
    gameMode: ['a', 'b'],
    gameOperation: ['minus'],
    gameDifficulty: 5,
    // info
    gameShape: 'square',
    assets: {
      menu: {
        gameNameBtn: 'game_2',
        infoBox: () => ({
          title: `<strong>${game.lang.game}:</strong> ${game.lang.square} II`,
          body: `<ul>${game.lang.infoBox_squareTwo}</ul>`,
          img: `<img class="mx-auto" width=60% src="${game.image['s2'].src}">`,
        }),
      },
      customMenu: {
        gameModeBtn: ['mode_4', 'mode_5'],
        gameOperationBtn: ['operation_equals'],
        auxiliarTitle: (x, y, offsetW, offsetH) => {
          game.add.text(
            x + 5 * offsetW,
            y + offsetH + 50,
            game.lang.show,
            textStyles.h4_
          );
          game.add.text(
            x + 5 * offsetW + 10,
            y + offsetH + 80,
            game.lang.aux_rectangle,
            textStyles.h4_
          );
        },
        infoBox: () => ({
          gameMode: {
            title: game.lang.game_modes,
            body: `<p>${game.lang.infoBox_mode}</p>`,
            img: `<table>
            <tr>
              <td><b>${game.lang.mode}: A</b> - ${game.lang.infoBox_mode_s2_A}</td>
              <td><b>${game.lang.mode}: B</b> - ${game.lang.infoBox_mode_s2_B}</td>
            </tr>
            <tr>
              <td><img width=98% src="${game.image['s2-A-h'].src}"></td>
              <td><img width=98% src="${game.image['s2-B-h'].src}"></td>
            </tr>
        <table>`,
          },
          gameDifficulty: {
            title: game.lang.difficulties,
            body: game.lang.infoBox_diff,
            img: `<table>
            <tr>
              <td><b>${game.lang.difficulty}:</b> 1</td>
              <td><b>${game.lang.difficulty}:</b> 5</td>
            </tr>
            <tr>
              <td><img width=100% src="${game.image['s2-diff-1'].src}"></td>
              <td style="border-left: 4px solid white"><img width=100% src="${game.image['s2-diff-5'].src}"></td>
            </tr>
          </table>
          <br>
          ${game.lang.infoBox_diff_aux}
          <div><img width=50% src="${game.image['map-c1s2'].src}"></div>`,
          },
          gameMisc: {
            title: `${game.lang.show} ${self.auxText}`,
            body: game.lang.infoBox_misc_rect,
            img: `<img class="mx-auto" width=100% src="${game.image['s2-label'].src}">`,
          },
        }),
      },
      map: {
        characterAnimation: (operation) => {
          return ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
        },
        character: (operation) => {
          const char = game.add.sprite(
            self.scene.roadPoints.x[curMapPosition],
            self.scene.roadPoints.y[curMapPosition],
            'kid_running',
            0,
            0.57
          );
          char.anchor(0, 0.85);
          return char;
        },
        startBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[0] - 193,
            self.scene.roadPoints.y[0] - 205,
            'house',
            1.03
          );
        },
        endBuilding: () => {
          return game.add.image(
            self.scene.roadPoints.x[5] - 28,
            self.scene.roadPoints.y[5] - 215,
            'school',
            0.52
          );
        },
      },
      end: {
        characterAnimation: () => [
          'move',
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          3,
        ],
        character: () => {
          const char = game.add.sprite(
            0,
            context.canvas.height - 240,
            'kid_running',
            0,
            1.05
          );
          char.anchor(0.5, 0.5);
          return char;
        },
        building: () =>
          game.add
            .image(
              context.canvas.width - 620,
              context.canvas.height - 20 - 15,
              'school',
              1.3
            )
            .anchor(0, 1),
      },
    },
  },
  // {
  //   gameName: 'scaleOne',
  //   gameMode: ['a'],
  //   gameOperation: ['plus'],
  //   gameDifficulty: 1,
  //   // info
  //   gameShape: 'noShape',
  //   assets: {
  //     menu: {
  //       gameNameBtn: 'game_3',
  //       // infoBox
  //     },
  //     customMenu: {
  //       gameModeBtn: ['mode_6'],
  //       gameOperationBtn: ['operation_equals'],
  //       auxiliarTitle: (x, y, offsetW, offsetH) => {},
  //       // infoBox
  //     },
  //     map: {
  //       characterAnimation: (operation) => {
  //         return operation === 'plus'
  //           ? ['green_tractor', [0, 1, 2, 3, 4], 3]
  //           : ['red_tractor', [10, 11, 12, 13, 14], 3];
  //       },
  //       character: (operation) => {
  //         let char;
  //         if (operation == 'plus') {
  //           char = game.add.sprite(
  //             self.scene.roadPoints.x[curMapPosition],
  //             self.scene.roadPoints.y[curMapPosition],
  //             'tractor',
  //             0,
  //             0.75
  //           );
  //         }
  //         if (operation === 'minus') {
  //           char = game.add.sprite(
  //             self.scene.roadPoints.x[curMapPosition],
  //             self.scene.roadPoints.y[curMapPosition],
  //             'tractor',
  //             10,
  //             0.75
  //           );
  //         }
  //         char.rotate = -30; // 25 counterclockwise
  //         return char;
  //       },
  //       startBuilding: () => {
  //         return game.add
  //           .image(self.scene.roadPoints.x[0], self.scene.roadPoints.y[0], 'garage', 0.6)
  //           .anchor(0.5, 1);
  //       },
  //       endBuilding: () => {
  //         return game.add
  //           .image(self.scene.roadPoints.x[5], self.scene.roadPoints.y[5], 'farm', 0.9)
  //           .anchor(0.4, 0.7);
  //       },
  //     },
  //     end: {
  //       // TODO
  //     },
  //   },
  // },
];
