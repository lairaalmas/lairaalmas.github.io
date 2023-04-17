const navigation = {
  list: [],
  prevState: undefined,
  audioIcon: undefined,
  showAnswerIcon: undefined,
  labelLeft: undefined,
  labelRight: undefined,

  add: {
    left: (icons, prevState) => {
      navigation.prevState = prevState;
      const iconSize = 75;
      let x = 10;
      navigation.labelLeft = game.add.text(x, 110, '', textStyles.p_);
      navigation.labelLeft.align = 'left';
      icons.forEach((icon) => {
        if (icon === 'back') {
          if (!prevState) {
            console.error(
              "Game error: You tried to add a 'back' icon without the 'state' parameter."
            );
            return;
          } else {
            navigation.prevState = prevState;
          }
        }
        if (icon === 'show_answer' && !self.utils.showAnswer) {
          console.error(
            "Game error: You tried to add a 'show_answer' icon without a 'showAnswer()' function o the game state."
          );
          return;
        }
        const asset = game.add.image(x, 10, icon, 1.5);
        navigation.showAnswerIcon = asset;
        navigation.list.push(asset);
        x += iconSize;
      });
    },

    right: (icons) => {
      const iconSize = 75;
      let x = context.canvas.width - iconSize - 10;
      navigation.labelRight = game.add.text(x + 60, 110, '', textStyles.p_);
      navigation.labelRight.align = 'right';
      icons.forEach((icon) => {
        let asset;
        if (icon === 'audio') {
          asset = game.add.sprite(x, 10, icon, 1, 1.5);
          asset.curFrame = audioStatus ? 0 : 1;
          navigation.audioIcon = asset;
        }

        if (icon === 'lang') asset = game.add.image(x, 10, 'lang', 1.5);

        navigation.list.push(asset);
        x -= iconSize;
      });
    },
  },

  changeState: (state) => {
    if (audioStatus) game.audio.popSound.play();

    game.event.clear(self);
    game.state.start(state);
  },

  disableIcon: (icon) => {
    icon.alpha = 0;
    icon.isDisabled = true;
  },

  onInputDown: (x, y) => {
    navigation.list.forEach((icon) => {
      if (game.math.isOverIcon(x, y, icon) && !icon.isDisabled) {
        const iconName = icon.name;
        switch (iconName) {
          case 'menu':
            navigation.changeState('menu');
            break;
          case 'lang':
            navigation.changeState('lang');
            break;
          case 'back':
            const state = navigation.prevState;
            navigation.changeState(state);
            break;
          case 'show_answer':
            if (navigation.showAnswerIcon.alpha === 1) {
              if (audioStatus) game.audio.popSound.play();
              self.utils.showAnswer();
              navigation.disableIcon(navigation.showAnswerIcon);
            }
            break;
          case 'audio':
            if (audioStatus) {
              audioStatus = false;
              navigation.audioIcon.curFrame = 1;
            } else {
              audioStatus = true;
              navigation.audioIcon.curFrame = 0;
              game.audio.popSound.play();
            }
            game.render.all();
            break;
          default:
            console.error('Game error: error in navigation icon');
        }
      }
    });
  },

  onInputOver: (x, y) => {
    let isOverIcon = false;
    navigation.list.forEach((icon) => {
      if (game.math.isOverIcon(x, y, icon) && !icon.isDisabled) {
        isOverIcon = true;
        const iconName = icon.name;
        switch (iconName) {
          case 'menu':
            navigation.labelLeft.name = game.lang.nav_menu;
            break;
          case 'lang':
            navigation.labelRight.name = game.lang.nav_lang;
            break;
          case 'back':
            navigation.labelLeft.name = game.lang.nav_back;
            break;
          case 'show_answer':
            navigation.labelLeft.name = game.lang.nav_help;
            break;
          case 'audio':
            navigation.labelRight.name = game.lang.audio;
            break;
        }
      }
    });
    if (!isOverIcon) {
      if (navigation.labelLeft) navigation.labelLeft.name = '';
      if (navigation.labelRight) navigation.labelRight.name = '';
    } else {
      document.body.style.cursor = 'pointer';
    }
  },
};

/**
 * Sends game information to database
 *
 * @param {string} extraData player information for the current game
 */
const sendToDatabase = function (extraData) {
  // FOR MOODLE
  if (moodle) {
    if (self.result) moodleVar.hits[curMapPosition - 1]++;
    else moodleVar.errors[curMapPosition - 1]++;

    moodleVar.time[curMapPosition - 1] += game.timer.elapsed;

    const url = iLMparameters.iLM_PARAM_ServerToGetAnswerURL;
    const grade = '' + getEvaluation();
    const report = getAnswer();
    const data =
      'return_get_answer=1' +
      '&iLM_PARAM_ActivityEvaluation=' +
      encodeURIComponent(grade) +
      '&iLM_PARAM_ArchiveContent=' +
      encodeURIComponent(report);

    const init = {
      method: 'POST',
      body: data,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    };

    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          if (isDebugMode) console.log('Processing...');
        } else {
          console.error('Game error: Network response was not ok.');
        }
      })
      .catch((error) => {
        console.error(
          'Game error: problem with fetch operation - ' + error.message + '.'
        );
      });
  } else {
    // Create some variables we need to send to our PHP file
    // Attention: this names must be compactible to data table (MySQL server)
    // @see php/save.php
    const data =
      'line_ip=143.107.45.11' + // INSERT database server IP
      '&line_name=' +
      playerName +
      '&line_lang=' +
      langString +
      extraData;

    const url = 'php/save.php';

    const init = {
      method: 'POST',
      body: data,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    };
    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          if (isDebugMode) console.log('Processing...');
          response.text().then((text) => {
            if (isDebugMode) {
              console.log(text);
            }
          });
        } else {
          console.error('Game error: Network response was not ok.');
        }
      })
      .catch((error) => {
        console.error(
          'Game error: problem with fetch operation - ' + error.message + '.'
        );
      });
  }
};

const renderBackground = (type) => {
  if (type === 'plain') {
    // Add plain blue background
    game.add.geom.rect(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
      colors.blueBg
    );
    return;
  }

  if (type === 'scale') {
    // Add background image
    game.add.image(0, 0, 'bg_snow', 1.8);

    const floor = {
      width: 128,
      last: context.canvas.width / 128,
      tiles: [3, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 4],
    };

    for (let i = 0; i < floor.tiles.length; i++) {
      game.add
        .sprite(i * floor.width, context.canvas.height, 'floor_snow', 0, 2)
        .anchor(0, 1);
      game.add
        .sprite(
          i * floor.width,
          context.canvas.height - 65,
          'floor_snow',
          floor.tiles[i],
          2
        )
        .anchor(0, 1);
    }

    game.add
      .image(-2, context.canvas.height - 410, 'wood_shelf', 2)
      .anchor(0, 1);
    game.add
      .image(-2, context.canvas.height - 650, 'wood_shelf', 2)
      .anchor(0, 1);

    game.add
      .sprite(4 * floor.width, context.canvas.height - 65, 'floor_snow', 7, 2)
      .anchor(0, 1);
    game.add
      .sprite(8 * floor.width, context.canvas.height - 65, 'floor_snow', 8, 2)
      .anchor(0, 1);
    game.add
      .sprite(13 * floor.width, context.canvas.height - 65, 'floor_snow', 7, 2)
      .anchor(0, 1);
    return;
  }

  // Add background image
  game.add.image(0, 0, 'bg_default', 2.2);

  // Add clouds
  game.add.image(300, context.canvas.height / 2 - 50, 'cloud', 1.5);
  game.add.image(700, context.canvas.height / 2 + 50 - 50, 'cloud', 1.5);
  game.add.image(1280, context.canvas.height / 2 - 50 - 50, 'cloud', 1.5);

  // Add floor
  const floorSize = 150;

  if (type === 'farmRoad') {
    game.add.image(0, context.canvas.height - floorSize, 'floor_grass', 1.5);
    for (let i = 1; i < context.canvas.width / floorSize - 1; i++) {
      game.add.image(
        i * floorSize,
        context.canvas.height - floorSize,
        'floor_road'
      );
    }
    game.add.image(
      context.canvas.width - floorSize,
      context.canvas.height - floorSize,
      'floor_grass',
      1.5
    );
    return;
  }

  for (let i = 0; i < context.canvas.width / floorSize; i++) {
    game.add.image(
      i * floorSize,
      context.canvas.height - floorSize,
      'floor_grass',
      1.5
    );
  }

  if (type === 'end') {
    game.add.geom.rect(
      0,
      context.canvas.height - floorSize * 2 + 15,
      150 * (context.canvas.width / floorSize),
      150,
      '#48d813'
    );
  }
};

const getFrameInfo = function () {
  let x0 = (y0 = 300);
  // width/height - offset on both sides
  let width = context.canvas.width - 2 * x0;
  let height = context.canvas.height - 2 * y0;

  let rect = function () {
    game.add.geom.rect(x0, y0, width, height, 'transparent', 1, colors.red, 2);
  };

  let point = function (offsetW, offsetH) {
    for (let i = 0, y1 = y; i < 4; i++) {
      x1 = x0;
      for (let j = 0; j < 7; j++) {
        let sqr = game.add.geom.rect(x1, y1, 20, 20, colors.red);
        sqr.anchor(0.5, 0.5);
        x1 += offsetW;
      }
      y1 += offsetH;
    }
  };
  return { x: x0, y: y0, width, height, rect, point };
};

const moveList = function (list, x, y) {
  list.forEach((item) => {
    item.x += x;
    item.y += y;
  });
};
