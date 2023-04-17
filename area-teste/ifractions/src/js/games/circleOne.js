/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *
 * .....circleOne.... = gameName
 * ....../...\.......
 * .....a.....b...... = gameMode
 * .......\./........
 * ........|.........
 * ....../.|.\.......
 * .plus.minus.mixed. = gameOperation
 * ......\.|./.......
 * ........|.........
 * ....1,2,3,4,5..... = gameDifficulty
 *
 * Character : kid/balloon
 * Theme : flying in a balloon
 * Concept : 'How much the kid has to walk to get to the balloon?'
 * Represent fractions as : circles/arcs
 *
 * Game modes can be :
 *
 *   a : Player can place balloon position
 *       Place balloon in position (so the kid can get to it)
 *   b : Player can select # of circles
 *       Selects number of circles (that represent distance kid needs to walk to get to the balloon)
 *
 * Operations can be :
 *
 *   plus : addition of fractions
 *     Represented by : kid going to the right (floor positions 0..5)
 *   minus : subtraction of fractions
 *     Represented by: kid going to the left (floor positions 5..0)
 *   mixed : Mix addition and subtraction of fractions in same
 *     Represented by: kid going to the left (floor positions 0..5)
 *
 * @namespace
 */
const circleOne = {
  ui: undefined,
  control: undefined,
  animation: undefined,
  road: undefined,

  circles: undefined,
  kid: undefined,
  balloon: undefined,
  basket: undefined,
  walkedPath: undefined,

  /**
   * Main code
   */
  create: function () {
    this.ui = {
      help: undefined,
      message: undefined,
      continue: {
        // modal: undefined,
        button: undefined,
        text: undefined,
      },
    };
    this.road = {
      x: 150,
      y: context.canvas.height - game.image['floor_grass'].width * 1.5,
      width: 1620,
    };
    this.walkedPath = [];

    const pointWidth = (game.sprite['map_place'].width / 2) * 0.45;
    const distanceBetweenPoints =
      (context.canvas.width - this.road.x * 2 - pointWidth) / 5; // Distance between road points
    const y0 = this.road.y + 20;
    const x0 =
      gameOperation === 'minus'
        ? context.canvas.width - this.road.x - pointWidth / 2
        : this.road.x + pointWidth / 2; // Initial 'x' coordinate for the kid and the baloon

    const diameter =
      game.math.getRadiusFromCircunference(distanceBetweenPoints) * 2;

    this.circles = {
      diameter: diameter, // (Fixed) Circles Diameter
      cur: 0, // Current circle index
      list: [], // Circle objects
    };

    this.control = {
      correctX: x0, // Correct position (accumulative)
      nextX: undefined, // Next point position
      divisorsList: '', // used in postScore (Accumulative)

      hasClicked: false, // Checks if user has clicked
      checkAnswer: false, // Check kid inside ballon's basket
      isCorrect: false, // Informs answer is correct
      showEndInfo: false,
      endSignX: undefined,
      curWalkedPath: 0,
      // mode 'b' exclusive
      correctIndex: undefined,
      selectedIndex: -1, // Index of clicked circle (game (b))
      numberOfPlusFractions: undefined,
    };

    const walkOffsetX = 2;
    const walksPerDistanceBetweenPoints = distanceBetweenPoints / walkOffsetX;
    this.animation = {
      list: {
        left: undefined,
        right: undefined,
      },
      invertDirection: undefined,
      animateKid: false,
      animateBalloon: false,
      counter: undefined,
      walkOffsetX,
      angleOffset: 360 / walksPerDistanceBetweenPoints,
    };

    renderBackground('farmRoad');

    // Calls function that loads navigation icons
    // FOR MOODLE
    if (moodle) {
      navigation.add.right(['audio']);
    } else {
      navigation.add.left(['back', 'menu', 'show_answer'], 'customMenu');
      navigation.add.right(['audio']);
    }

    const validPath = { x0, y0, distanceBetweenPoints };

    this.utils.renderRoad(validPath);

    const [restart, balloonX] = this.utils.renderCircles(validPath);
    this.restart = restart;

    this.utils.renderCharacters(validPath, balloonX);
    this.utils.renderMainUI();

    if (!this.restart) {
      game.timer.start(); // Set a timer for the current level (used in postScore())
      game.event.add('click', this.events.onInputDown);
      game.event.add('mousemove', this.events.onInputOver);
    }
  },

  /**
   * Game loop
   */
  update: function () {
    // Starts kid animation
    if (self.animation.animateKid) {
      self.utils.animateKidHandler();
    }

    // Check if kid is inside the basket
    if (self.control.checkAnswer) {
      self.utils.checkAnswerHandler();
    }

    // Starts balloon flying animation
    if (self.animation.animateBalloon) {
      self.utils.animateBalloonHandler();
    }

    game.render.all();
  },

  utils: {
    // RENDERS
    renderRoad: function (validPath) {
      const directionModifier = gameOperation === 'minus' ? -1 : 1;
      for (let i = 0; i <= 5; i++) {
        // place
        game.add
          .sprite(
            validPath.x0 +
              i * validPath.distanceBetweenPoints * directionModifier,
            validPath.y0,
            'map_place',
            0,
            0.45
          )
          .anchor(0.5, 0.5);
        // circle behind number
        game.add.geom
          .circle(
            validPath.x0 +
              i * validPath.distanceBetweenPoints * directionModifier,
            validPath.y0 + 60,
            60,
            undefined,
            0,
            colors.white,
            0.8
          )
          .anchor(0, 0.25);
        // number
        game.add.text(
          validPath.x0 +
            i * validPath.distanceBetweenPoints * directionModifier,
          validPath.y0 + 60,
          i * directionModifier,
          {
            ...textStyles.h2_,
            font: 'bold ' + textStyles.h2_.font,
            fill: directionModifier === 1 ? colors.green : colors.red,
          }
        );
      }

      self.utils.renderWalkedPath(
        validPath.x0 - 1,
        validPath.y0 - 5,
        gameOperation === 'minus' ? colors.red : colors.green
      );
    },
    renderWalkedPath: function (x, y, color) {
      const path = game.add.geom.rect(x, y, 1, 1, 'transparent', 1, color, 4);
      self.walkedPath.push(path);
      return path;
    },
    renderCircles: function (validPath) {
      let restart = false;
      let hasBaseDifficulty = false;
      let balloonX = context.canvas.width / 2;

      const directionModifier = gameOperation === 'minus' ? -1 : 1;
      const fractionX =
        validPath.x0 - (self.circles.diameter - 10) * directionModifier;
      const font = {
        ...textStyles.h2_,
        font: 'bold ' + textStyles.h2_.font,
      };
      // Number of circles
      const max = gameOperation === 'mixed' ? 6 : curMapPosition + 1;

      const min =
        curMapPosition === 1 && (gameOperation === 'mixed' || gameMode === 'b')
          ? 2
          : curMapPosition; // Mixed level has at least 2 fractions

      const total = game.math.randomInRange(min, max); // Total number of circles

      // for mode 'b'
      self.control.numberOfPlusFractions = game.math.randomInRange(
        1,
        total - 1
      );

      for (let i = 0; i < total; i++) {
        let curDirection = undefined;
        let curLineColor = undefined;
        let curFillColor = undefined;
        let curAngleDegree = undefined;
        let curIsCounterclockwise = undefined;
        let curFractionItems = undefined;
        let curCircle = undefined;
        const curCircleInfo = {
          direction: undefined,
          direc: undefined,
          distance: undefined,
          angle: undefined,
          fraction: {
            labels: [],
            nominator: undefined,
            denominator: undefined,
          },
        };
        const curDivisor = game.math.randomInRange(1, gameDifficulty); // Set fraction 'divisor' (depends on difficulty)

        if (curDivisor === gameDifficulty) hasBaseDifficulty = true; // True if after for ends has at least 1 '1/difficulty' fraction

        self.control.divisorsList += curDivisor + ','; // Add this divisor to the list of divisors (for postScore())

        // Set each circle direction
        switch (gameOperation) {
          case 'plus':
            curDirection = 'right';
            break;
          case 'minus':
            curDirection = 'left';
            break;
          case 'mixed':
            curDirection =
              i < self.control.numberOfPlusFractions ? 'right' : 'left';
            break;
        }
        curCircleInfo.direction = curDirection;

        // Set each circle visual info
        if (curDirection === 'right') {
          curIsCounterclockwise = true;
          curLineColor = colors.green;
          curFillColor = colors.greenLight;
          curCircleInfo.direc = 1;
        } else {
          curIsCounterclockwise = false;
          curLineColor = colors.red;
          curFillColor = colors.redLight;
          curCircleInfo.direc = -1;
        }
        font.fill = curLineColor;

        const curCircleY =
          validPath.y0 -
          5 -
          self.circles.diameter / 2 -
          i * self.circles.diameter;

        // Draw circles
        if (curDivisor === 1) {
          curAngleDegree = 360;
          curCircle = game.add.geom.circle(
            validPath.x0,
            curCircleY,
            self.circles.diameter,
            curLineColor,
            3,
            curFillColor,
            1
          );
          curCircle.counterclockwise = curIsCounterclockwise;
          curCircleInfo.angleDegree = curAngleDegree;

          curFractionItems = [
            {
              x: fractionX,
              y: curCircleY + 10,
              text: '1',
            },
            {
              x: fractionX,
              y: curCircleY - 2,
              text: '',
            },
            {
              x: fractionX,
              y: curCircleY - 2,
              text: '',
            },
            {
              x: fractionX - 25,
              y: curCircleY + 10,
              text: curDirection === 'left' ? '-' : '',
            },
          ];
        } else {
          curAngleDegree = 360 / curDivisor;
          if (curDirection === 'right') curAngleDegree = 360 - curAngleDegree; // counterclockwise equivalent

          curCircle = game.add.geom.arc(
            validPath.x0,
            curCircleY,
            self.circles.diameter,
            0,
            game.math.degreeToRad(curAngleDegree),
            curIsCounterclockwise,
            curLineColor,
            3,
            curFillColor,
            1
          );
          curCircleInfo.angleDegree = curAngleDegree;

          curFractionItems = [
            {
              x: fractionX,
              y: curCircleY + 34,
              text: curDivisor,
            },
            {
              x: fractionX,
              y: curCircleY - 2,
              text: '1',
            },
            {
              x: fractionX,
              y: curCircleY - 2,
              text: '__',
            },
            {
              x: fractionX - 35,
              y: curCircleY + 15,
              text: curDirection === 'left' ? '-' : '',
            },
          ];
        }

        if (showFractions) {
          for (let cur in curFractionItems) {
            curCircleInfo.fraction.labels.push(
              game.add.text(
                curFractionItems[cur].x,
                curFractionItems[cur].y,
                curFractionItems[cur].text,
                font
              )
            );
          }
          curCircleInfo.fraction.nominator = curCircleInfo.direc;
          curCircleInfo.fraction.denominator = curDivisor;
        }

        curCircle.rotate = 90;

        // If game is type (b) (select fractions)
        if (gameMode === 'b') {
          curCircle.index = i;
        }

        curCircleInfo.distance = Math.floor(
          validPath.distanceBetweenPoints / curDivisor
        );

        // Add to the list
        curCircle.info = curCircleInfo;
        self.circles.list.push(curCircle);

        self.control.correctX +=
          Math.floor(validPath.distanceBetweenPoints / curDivisor) *
          curCircle.info.direc;
      }

      // Restart if
      // Does not have at least one fraction of type 1/difficulty
      if (!hasBaseDifficulty) {
        restart = true;
      }

      // Calculate next circle
      self.control.nextX =
        validPath.x0 +
        self.circles.list[0].info.distance * self.circles.list[0].info.direc;

      if (gameMode === 'b') {
        // Restart if
        // Correct position is out of bounds
        let isBeforeMin, isAfterMax;
        if (gameOperation === 'minus') {
          isBeforeMin = self.control.correctX > validPath.x0;
          isAfterMax =
            self.control.correctX <
            validPath.x0 - 5 * validPath.distanceBetweenPoints;
        } else {
          isBeforeMin = self.control.correctX < validPath.x0;
          isAfterMax =
            self.control.correctX >
            validPath.x0 + 5 * validPath.distanceBetweenPoints;
        }
        if (isBeforeMin || isAfterMax) restart = true;

        // If game is type (b), selectiong a random balloon place
        balloonX = validPath.x0;

        self.control.correctIndex = game.math.randomInRange(
          self.control.numberOfPlusFractions,
          self.circles.list.length
        );

        for (let i = 0; i < self.control.correctIndex; i++) {
          balloonX +=
            self.circles.list[i].info.distance *
            self.circles.list[i].info.direc;
        }

        // Restart if
        // Balloon position is out of bounds
        if (gameOperation === 'minus') {
          isBeforeMin = balloonX > validPath.x0;
          isAfterMax =
            balloonX < validPath.x0 - 5 * validPath.distanceBetweenPoints;
        } else {
          isBeforeMin = balloonX < validPath.x0;
          isAfterMax =
            balloonX > validPath.x0 + 5 * validPath.distanceBetweenPoints;
        }
        if (isBeforeMin || isAfterMax) restart = true;
      }

      return [restart, balloonX];
    },
    renderCharacters: function (validPath, balloonX) {
      // KID
      self.kid = game.add.sprite(
        validPath.x0,
        validPath.y0 - 32 - self.circles.list.length * self.circles.diameter,
        'kid_walking',
        0,
        1.2
      );
      self.kid.anchor(0.5, 0.8);

      self.animation.list.right = [
        'right',
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        4,
      ];
      self.animation.list.left = [
        'left',
        [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
        4,
      ];

      if (gameOperation === 'minus') {
        self.kid.animation = self.animation.list.left;
        self.kid.curFrame = 23;
      } else {
        self.kid.animation = self.animation.list.right;
      }

      // BALLOON
      self.balloon = game.add.image(
        balloonX,
        validPath.y0 - 295,
        'balloon',
        1.5,
        0.5
      );
      self.balloon.alpha = 0.5;
      self.balloon.anchor(0.5, 0.5);

      self.basket = game.add.image(
        balloonX,
        validPath.y0 - 95,
        'balloon_basket',
        1.5
      );
      self.basket.alpha = 0.8;
      self.basket.anchor(0.5, 0.5);
    },
    renderMainUI: function () {
      // Help pointer
      self.ui.help = game.add.image(0, 0, 'pointer', 2, 0);

      // Intro text
      const correctMessage =
        gameMode === 'a'
          ? game.lang.circleOne_intro_a
          : game.lang.circleOne_intro_b;
      const treatedMessage = correctMessage.split('\\n');
      self.ui.message = [];
      self.ui.message.push(
        game.add.text(
          context.canvas.width / 2,
          170,
          treatedMessage[0],
          textStyles.h1_
        )
      );
      self.ui.message.push(
        game.add.text(
          context.canvas.width / 2,
          220,
          treatedMessage[1],
          textStyles.h1_
        )
      );
    },
    renderOperationUI: function () {
      let validCircles = self.circles.list;
      if (gameMode === 'b') {
        validCircles = [];
        for (let i = 0; i <= self.control.selectedIndex; i++) {
          validCircles.push(self.circles.list[i]);
        }
      }

      const font = textStyles.fraction;
      font.fill = colors.green;

      const nominators = [];
      const denominators = [];
      const renderList = [];

      const padding = 100;
      const offsetX = 100;
      const widthOfChar = 35;

      const x0 = padding;
      const y0 = context.canvas.height / 3;
      let nextX = x0;

      const cardHeight = 400;
      const cardX = x0 - padding;
      const cardY = y0;

      // Card
      const card = game.add.geom.rect(
        cardX,
        cardY,
        0,
        cardHeight,
        colors.blueLight,
        0.5,
        colors.blueDark,
        8
      );
      card.id = 'card';
      card.anchor(0, 0.5);
      renderList.push(card);

      // Fraction list
      for (let i in validCircles) {
        const curFraction = validCircles[i].info.fraction;
        let curFractionSign = '+';
        if (curFraction.labels[3].name === '-') {
          curFractionSign = '-';
          font.fill = colors.red;
        }

        renderList.push(
          game.add.text(x0 + i * offsetX, y0 + 35, curFractionSign, font)
        );
        renderList.push(
          game.add.text(x0 + i * offsetX + offsetX / 2, y0, '1', font)
        );
        renderList.push(
          game.add.text(x0 + offsetX / 2 + i * offsetX, y0, '_', font)
        );
        renderList.push(
          game.add.text(
            x0 + i * offsetX + offsetX / 2,
            y0 + 70,
            curFraction.labels[0].name,
            font
          )
        );

        nominators.push(curFraction.nominator);
        denominators.push(curFraction.denominator);
      }

      // Setup for fraction operation with least common multiple
      font.fill = colors.black;
      const updatedNominators = [];
      const mmc = game.math.mmcArray(denominators);
      let resultNominator = 0;
      for (let i in nominators) {
        const temp = nominators[i] * (mmc / denominators[i]);
        updatedNominators.push(temp);
        resultNominator += temp;
      }
      const resultNominatorUnsigned =
        resultNominator < 0 ? -resultNominator : resultNominator;
      const resultAux = resultNominator / mmc;
      const result =
        ('' + resultAux).length > 4 ? resultAux.toFixed(2) : resultAux;

      // let fracLine = '';
      // const updatedNominatorsString = updatedNominators
      //   .map((n) => {
      //     const len = ('' + n).length;
      //     for (let i = 0; i < len; i++) fracLine += '_';
      //     fracLine = n < 0 ? fracLine : fracLine + '_';
      //     return n >= 0 ? '+' + n : n;
      //   })
      //   .join('');
      // const fractionMiddleX = widthOfChar * (fracLine.length / 2);

      // Fraction operation with least common multiple
      nextX = x0 + validCircles.length * offsetX + 20;
      // renderList.push(game.add.text(nextX, y0 + 35, '=', font));

      // nextX += offsetX / 2;
      // renderList.push(game.add.text(nextX, y0, updatedNominatorsString, font));
      // renderList.push(
      //   game.add.text(nextX + fractionMiddleX, y0 + 70, mmc, font)
      // );
      // renderList.push(game.add.text(nextX, y0, fracLine, font));

      // Fraction result
      //nextX += fractionMiddleX * 2 + 50;
      renderList.push(game.add.text(nextX, y0 + 35, '=', font));

      font.align = 'center';
      nextX += offsetX + 40;
      renderList.push(
        game.add.text(nextX - 80, y0 + 35, result >= 0 ? '' : '-', font)
      );
      renderList.push(game.add.text(nextX, y0, resultNominatorUnsigned, font));
      renderList.push(game.add.text(nextX, y0 + 70, mmc, font));
      renderList.push(game.add.text(nextX, y0, '___', font));

      // Fraction result simplified setup
      const mdcAux = game.math.mdc(resultNominator, mmc);
      const mdc = mdcAux < 0 ? -mdcAux : mdcAux;
      if (mdc !== 1) {
        nextX += offsetX;
        renderList.push(game.add.text(nextX, y0 + 35, '=', font));

        nextX += offsetX;
        renderList.push(
          game.add.text(nextX - 50, y0 + 35, result > 0 ? '' : '-', font)
        );
        renderList.push(
          game.add.text(nextX, y0, resultNominatorUnsigned / mdc, font)
        );
        renderList.push(game.add.text(nextX, y0 + 70, mmc / mdc, font));
        renderList.push(game.add.text(nextX, y0, '__', font));
      }

      // Decimal result
      // nextX += offsetX;
      // renderList.push(game.add.text(nextX, y0 + 35, '=', font));

      // nextX += offsetX / 2;
      // renderList.push(game.add.text(nextX, y0 + 35, result, font));

      //let resultWidth = ('' + result).length * widthOfChar;
      let resultWidth = '__'.length * widthOfChar;
      const cardWidth = nextX - x0 + resultWidth + padding * 2;
      card.width = cardWidth;

      const endSignX = (context.canvas.width - cardWidth) / 2 + cardWidth;

      // Center Card
      moveList(renderList, (context.canvas.width - cardWidth) / 2, 0);

      self.fractionOperationUI = renderList;

      return endSignX;
    },
    renderEndUI: () => {
      let btnColor = colors.green;
      let btnText = game.lang.continue;

      if (!self.control.isCorrect) {
        btnColor = colors.red;
        btnText = game.lang.retry;
      }

      // continue button
      self.ui.continue.button = game.add.geom.rect(
        context.canvas.width / 2,
        context.canvas.height / 2 + 100,
        450,
        100,
        btnColor
      );
      self.ui.continue.button.anchor(0.5, 0.5);
      self.ui.continue.text = game.add.text(
        context.canvas.width / 2,
        context.canvas.height / 2 + 16 + 100,
        btnText,
        textStyles.btn
      );
    },

    // UPDATE
    animateKidHandler: function () {
      let canLowerCircles = undefined;
      let curCircle = self.circles.list[self.circles.cur];
      let curDirec = curCircle.info.direc;

      // Move
      self.circles.list.forEach((circle) => {
        circle.x += self.animation.walkOffsetX * curDirec;
      });
      self.kid.x += self.animation.walkOffsetX * curDirec;
      self.walkedPath[self.control.curWalkedPath].width +=
        self.animation.walkOffsetX * curDirec;

      // Update arc
      curCircle.info.angleDegree += self.animation.angleOffset * curDirec;
      curCircle.angleEnd = game.math.degreeToRad(curCircle.info.angleDegree);

      // When finish current circle
      if (curCircle.info.direction === 'right') {
        canLowerCircles = curCircle.x >= self.control.nextX;
      } else if (curCircle.info.direction === 'left') {
        canLowerCircles = curCircle.x <= self.control.nextX;
        // If just changed from 'right' to 'left' inform to change direction of kid animation
        if (
          self.animation.invertDirection === undefined &&
          self.circles.cur > 0 &&
          self.circles.list[self.circles.cur - 1].info.direction === 'right'
        ) {
          self.animation.invertDirection = true;
        }
      }

      // Change direction of kid animation
      if (self.animation.invertDirection) {
        self.animation.invertDirection = false;
        game.animation.stop(self.kid.animation[0]);

        self.kid.animation = self.animation.list.left;
        self.kid.curFrame = 23;
        game.animation.play('left');

        self.control.curWalkedPath = 1;
        self.utils.renderWalkedPath(
          curCircle.x,
          self.walkedPath[0].y + 8,
          colors.red
        );
      }

      if (canLowerCircles) {
        // Hide current circle
        curCircle.alpha = 0;

        // Lowers kid and other circles
        self.circles.list.forEach((circle) => {
          circle.y += self.circles.diameter;
        });
        self.kid.y += self.circles.diameter;

        self.circles.cur++; // Update index of current circle

        if (self.circles.list[self.circles.cur]) {
          curCircle = self.circles.list[self.circles.cur];
          curDirec = curCircle.info.direc;
          self.control.nextX += curCircle.info.distance * curDirec; // Update next position
        }
      }

      // When finish all circles (final position)
      if (
        self.circles.cur === self.circles.list.length ||
        curCircle.alpha === 0
      ) {
        self.animation.animateKid = false;
        self.control.checkAnswer = true;
      }
    },
    checkAnswerHandler: function () {
      game.timer.stop();

      game.animation.stop(self.kid.animation[0]);

      self.control.isCorrect = game.math.isOverlap(self.basket, self.kid);

      const x = self.utils.renderOperationUI();

      if (self.control.isCorrect) {
        completedLevels++;
        self.kid.curFrame = self.kid.curFrame < 12 ? 24 : 25;
        if (audioStatus) game.audio.okSound.play();
        game.add
          .image(x + 50, context.canvas.height / 3, 'answer_correct')
          .anchor(0.5, 0.5);
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        if (audioStatus) game.audio.errorSound.play();
        game.add
          .image(x, context.canvas.height / 3, 'answer_wrong')
          .anchor(0.5, 0.5);
      }

      self.fetch.postScore();

      self.control.checkAnswer = false;
      self.animation.counter = 0;

      self.animation.animateBalloon = true;
    },
    animateBalloonHandler: function () {
      self.animation.counter++;
      self.balloon.y -= 2;
      self.basket.y -= 2;

      if (self.control.isCorrect) self.kid.y -= 2;

      if (self.animation.counter === 100) {
        self.utils.renderEndUI();
        self.control.showEndInfo = true;

        if (self.control.isCorrect) canGoToNextMapPosition = true;
        else canGoToNextMapPosition = false;
      }
    },
    endLevel: function () {
      game.state.start('map');
    },

    // INFORMATION
    /**
     * Show correct answer
     */
    showAnswer: function () {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode === 'a') {
          self.ui.help.x = self.control.correctX - 20;
          self.ui.help.y = self.road.y;
          // On gameMode (b)
        } else {
          self.ui.help.x = self.circles.list[self.control.correctIndex - 1].x;
          self.ui.help.y = self.circles.list[self.control.correctIndex - 1].y; // -            self.circles.diameter / 2;
        }
        self.ui.help.alpha = 1;
      }
    },

    // HANDLERS
    /**
     * (in gameMode 'b') Function called when player clicked over a valid circle
     *
     * @param {number|object} cur clicked circle
     */
    clickCircleHandler: function (cur) {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode === 'a') {
          self.balloon.x = cur;
          self.basket.x = cur;
        }

        // On gameMode (b)
        if (gameMode === 'b') {
          document.body.style.cursor = 'auto';

          for (let i in self.circles.list) {
            if (i <= cur.index) {
              self.circles.list[i].alpha = 1; // Keep selected circle
              self.control.selectedIndex = cur.index;
            } else {
              self.circles.list[i].alpha = 0; // Hide unselected circle
              self.kid.y += self.circles.diameter; // Lower kid to selected circle
            }
          }
        }

        if (audioStatus) game.audio.popSound.play();

        // Hide fractions
        if (showFractions) {
          self.circles.list.forEach((circle) => {
            circle.info.fraction.labels.forEach((labelPart) => {
              labelPart.alpha = 0;
            });
          });
        }

        // Hide solution pointer
        if (self.ui.help != undefined) self.ui.help.alpha = 0;

        self.ui.message[0].alpha = 0;
        self.ui.message[1].alpha = 0;

        navigation.disableIcon(navigation.showAnswerIcon);

        self.balloon.alpha = 1;
        self.basket.alpha = 1;
        self.walkedPath[self.control.curWalkedPath].alpha = 1;

        self.control.hasClicked = true;
        self.animation.animateKid = true;

        game.animation.play(self.kid.animation[0]);
      }
    },
    /**
     * (in gameMode 'b') Function called when cursor is over a valid circle
     *
     * @param {object} cur circle the cursor is over
     */
    overCircleHandler: function (cur) {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'pointer';
        for (let i in self.circles.list) {
          const alpha = i <= cur.index ? 1 : 0.4;
          self.circles.list[i].alpha = alpha;
          self.circles.list[i].info.fraction.labels.forEach((lbl) => {
            lbl.alpha = alpha;
          });
        }
      }
    },
    /**
     * (in gameMode 'b') Function called when cursor leaves a valid circle
     */
    outCircleHandler: function () {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'auto';
        const alpha = 1;
        self.circles.list.forEach((circle) => {
          circle.alpha = alpha;
          circle.info.fraction.labels.forEach((lbl) => {
            lbl.alpha = alpha;
          });
        });
      }
    },
  },

  events: {
    /**
     * Called by mouse click event
     *
     * @param {object} mouseEvent contains the mouse click coordinates
     */
    onInputDown: function (mouseEvent) {
      const x = game.math.getMouse(mouseEvent).x;
      const y = game.math.getMouse(mouseEvent).y;

      // GAME MODE A : click road
      if (gameMode === 'a') {
        const isValid =
          y > 150 && x >= self.road.x && x <= self.road.x + self.road.width;
        if (isValid) self.utils.clickCircleHandler(x);
      }

      // GAME MODE B : click circle
      if (gameMode === 'b') {
        self.circles.list.forEach((circle) => {
          const isValid =
            game.math.distanceToPointer(
              x,
              circle.xWithAnchor,
              y,
              circle.yWithAnchor
            ) <=
            (circle.diameter / 2) * circle.scale;
          if (isValid) self.utils.clickCircleHandler(circle);
        });
      }

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          self.utils.endLevel();
        }
      }

      navigation.onInputDown(x, y);

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
      let isOverCircle = false;

      // GAME MODE A : balloon follow mouse
      if (gameMode === 'a' && !self.control.hasClicked) {
        if (
          game.math.distanceToPointer(x, self.balloon.x, y, self.balloon.y) > 8
        ) {
          self.balloon.x = x;
          self.basket.x = x;
        }
        document.body.style.cursor = 'auto';
      }

      // GAME MODE B : hover circle
      if (gameMode === 'b' && !self.control.hasClicked) {
        self.circles.list.forEach((circle) => {
          const isValid =
            game.math.distanceToPointer(
              x,
              circle.xWithAnchor,
              y,
              circle.yWithAnchor
            ) <=
            (circle.diameter / 2) * circle.scale;
          if (isValid) {
            self.utils.overCircleHandler(circle);
            isOverCircle = true;
          }
        });
        if (!isOverCircle) self.utils.outCircleHandler();
      }

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          // If pointer is over icon
          document.body.style.cursor = 'pointer';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1.1;
          self.ui.continue.text.style = textStyles.btnLg;
        } else {
          // If pointer is not over icon
          document.body.style.cursor = 'auto';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1;
          self.ui.continue.text.style = textStyles.btn;
        }
      }

      navigation.onInputOver(x, y);

      game.render.all();
    },
  },

  fetch: {
    /**
     * Saves players data after level ends - to be sent to database <br>
     *
     * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
     *
     * @see /php/squareOne.js
     */
    postScore: function () {
      // Creates string that is going to be sent to db
      const data =
        '&line_game=' +
        gameShape +
        '&line_mode=' +
        gameMode +
        '&line_oper=' +
        gameOperation +
        '&line_leve=' +
        gameDifficulty +
        '&line_posi=' +
        curMapPosition +
        '&line_resu=' +
        self.control.isCorrect +
        '&line_time=' +
        game.timer.elapsed +
        '&line_deta=' +
        'numCircles:' +
        self.circles.list.length +
        ', valCircles: ' +
        self.control.divisorsList +
        ' balloonX: ' +
        self.basket.x +
        ', selIndex: ' +
        self.control.selectedIndex;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
