// /******************************
//  * This file holds game states.
//  ******************************/

// /** [GAME STATE]
//  *
//  *  ...
//  *
//  * @namespace
//  */
// const scaleOne = {
//   /**
//    * Main code
//    */
//   create: function () {
//     this.control = {
//       scale: {
//         x0: (context.canvas.width / 3) * 2,
//         y0: context.canvas.height - 128,
//         rotation: 0,
//       },
//       icicles: { x0: 100, y0: 197, coordinates: undefined },
//     };
//     this.control.icicles.coordinates = [
//       { x: this.control.icicles.x0, y: this.control.icicles.y0 },
//       { x: this.control.icicles.x0 + 160, y: this.control.icicles.y0 },
//       { x: this.control.icicles.x0 + 160 * 2, y: this.control.icicles.y0 },
//       { x: this.control.icicles.x0, y: this.control.icicles.y0 + 160 * 1.5 },
//       {
//         x: this.control.icicles.x0 + 160,
//         y: this.control.icicles.y0 + 160 * 1.5,
//       },
//       {
//         x: this.control.icicles.x0 + 160 * 2,
//         y: this.control.icicles.y0 + 160 * 1.5,
//       },
//     ];
//     this.scale = {
//       base: null,
//       top: null,
//       plate_left: null,
//       plate_right: null,
//     };

//     this.icicles = [];
//     this.icicleFractions = [];

//     renderBackground('scale');

//     // Calls function that loads navigation icons

//     // FOR MOODLE
//     if (moodle) {
//       navigationIcons.add(
//         false,
//         false,
//         false, // Left icons
//         true,
//         false, // Right icons
//         false,
//         false
//       );
//     } else {
//       navigationIcons.add(
//         true,
//         true,
//         true, // Left icons
//         true,
//         false, // Right icons
//         'customMenu',
//         this.showAnswer
//       );
//     }

//     this.renderList.scale();
//     this.renderList.icicles();

//     // teste

//     this.iciclesIA = game.add.sprite(
//       this.control.scale.x0 + 260,
//       100, // this.scale.top.y - 180,
//       'floor_snow',
//       2,
//       2
//     );
//     this.iciclesIA.anchor(0.5, 0.5);

//     this.iciclesIAFractions = game.add.text(
//       this.control.scale.x0 + 260,
//       100 + 40, // this.scale.top.y - 180,
//       '1/2',
//       textStyles.h2_blue
//     );

//     this.iciclesIAControl = {
//       counter: 0,
//       direction: 'initial',
//       index: 0,
//     };

//     //game.timer.start(); // Set a timer for the current level (used in postScore())
//     game.event.add('click', this.onInputDown);
//     game.event.add('mousemove', this.onInputOver);
//   },

//   renderList: {
//     scale: () => {
//       // base of the scale
//       self.scale.base = game.add.image(
//         self.control.scale.x0,
//         self.control.scale.y0,
//         'scale_base',
//         2
//       );

//       // top of the scale
//       self.scale.top = game.add.image(
//         self.control.scale.x0,
//         self.control.scale.y0 - 170,
//         'scale_arm',
//         2
//       );
//       self.scale.top.rotate = self.control.scale.rotate;

//       // left plate
//       self.scale.plate_left = game.add.image(
//         self.control.scale.x0 - 258,
//         self.scale.top.y - 30,
//         'scale_plate',
//         2
//       );

//       // right plate
//       self.scale.plate_right = game.add.image(
//         self.control.scale.x0 + 258,
//         self.scale.top.y - 30,
//         'scale_plate',
//         2
//       );

//       for (let item in self.scale) {
//         if (self.scale[item] !== null) self.scale[item].anchor(0.5, 1);
//       }
//     },
//     icicles: () => {
//       for (let i = 0; i < self.control.icicles.coordinates.length; i++) {
//         const icicle = game.add.sprite(
//           self.control.icicles.coordinates[i].x,
//           self.control.icicles.coordinates[i].y,
//           'floor_snow',
//           2,
//           2
//         );
//         const fractionTop = game.add.text(
//           self.control.icicles.coordinates[i].x + 65,
//           self.control.icicles.coordinates[i].y + 120,
//           '1',
//           textStyles.h2_blue
//         );
//         const fractionLine = game.add.text(
//           self.control.icicles.coordinates[i].x + 65,
//           self.control.icicles.coordinates[i].y + 120 + 3,
//           '__',
//           textStyles.h2_blue
//         );
//         const fractionBottom = game.add.text(
//           self.control.icicles.coordinates[i].x + 65,
//           self.control.icicles.coordinates[i].y + 120 * 1.4,
//           '2',
//           textStyles.h2_blue
//         );

//         self.icicles.push(icicle);
//         // self.icicleFractions.push({
//         //   fractionTop,
//         //   fractionLine,
//         //   fractionBottom,
//         // });
//         // self.icicleFractions.push({
//         //   fractionTop: fractionTop,
//         //   fractionLine: fractionLine,
//         //   fractionBottom: fractionBottom,
//         // });
//       }
//     },
//   },
//   animationList: {
//     initial: () => {
//       const rotationOffset = 10 / 3;
//       // lower icicle
//       if (self.iciclesIA.y < self.scale.top.y - 180) {
//         moveList([self.iciclesIA, self.iciclesIAFractions], 0, 15);
//       }
//       // make balance tend to the right
//       else if (self.iciclesIAControl.counter <= 3) {
//         moveList(
//           [self.iciclesIA, self.iciclesIAFractions, self.scale.plate_right],
//           0,
//           15
//         );
//         moveList([self.scale.plate_left], 0, -3);
//         self.scale.top.rotate = 10 / 3;

//         self.iciclesIAControl.counter++;
//       } else {
//         if (self.iciclesIAControl.counter > 59) {
//           self.iciclesIAControl.counter = 0;
//           self.iciclesIAControl.direction = 'left';
//         }
//         self.iciclesIAControl.counter++;
//       }
//     },

//     scaleLeft: () => {
//       // const rotationOffset = 10 / 5;
//       // const distancia = 9 * 5; // 45

//       if (self.iciclesIAControl.counter <= 9) {
//         moveList(
//           [self.iciclesIA, self.iciclesIAFractions, self.scale.plate_right],
//           0,
//           -5
//         );
//         moveList([self.scale.plate_left], 0, 5);
//         self.scale.top.rotate = -10 / 3;

//         self.iciclesIAControl.counter++;
//       } else {
//         if (self.iciclesIAControl.counter > 59) {
//           self.iciclesIAControl.counter = 0;
//           self.iciclesIAControl.direction = 'right';
//         }
//         self.iciclesIAControl.counter++;
//       }
//     },

//     scaleRight: () => {
//       //const rotationOffset = 10 / 5;

//       if (self.iciclesIAControl.counter <= 9) {
//         moveList(
//           [self.iciclesIA, self.iciclesIAFractions, self.scale.plate_right],
//           0,
//           5
//         );
//         moveList([self.scale.plate_left], 0, -5);
//         self.scale.top.rotate = 10 / 3;

//         self.iciclesIAControl.counter++;
//       } else {
//         if (self.iciclesIAControl.counter > 59) {
//           self.iciclesIAControl.counter = 0;
//           self.iciclesIAControl.direction = 'left';
//         }
//         self.iciclesIAControl.counter++;
//       }
//     },
//   },

//   /**
//    * Game loop
//    */
//   update: function () {
//     if (self.iciclesIAControl.direction === 'initial') {
//       self.animationList.initial();
//     }

//     if (self.iciclesIAControl.direction === 'left') {
//       self.animationList.scaleLeft();
//     }

//     if (self.iciclesIAControl.direction === 'right') {
//       self.animationList.scaleRight();
//     }

//     game.render.all();
//   },

//   /**
//    * Function called by self.onInputOver() when cursor is over a valid rectangle
//    *
//    * @param {object} cur rectangle the cursor is over
//    */
//   overIcicleHandler: function (cur) {
//     for (let i in self.icicles) {
//       if (i === cur.index) {
//         self.icicles[i].scale = 1.2;
//       }
//     }
//   },

//   /**
//    * Called by mouse click event
//    *
//    * @param {object} mouseEvent contains the mouse click coordinates
//    */
//   onInputDown: function (mouseEvent) {
//     const x = game.math.getMouse(mouseEvent).x;
//     const y = game.math.getMouse(mouseEvent).y;

//     navigationIcons.onInputDown(x, y);
//     game.render.all();
//   },

//   /**
//    * Called by mouse move event
//    *
//    * @param {object} mouseEvent contains the mouse move coordinates
//    */
//   onInputOver: function (mouseEvent) {
//     const x = game.math.getMouse(mouseEvent).x;
//     const y = game.math.getMouse(mouseEvent).y;

//     self.icicles.forEach((icicle) => {
//       if (game.math.isOverIcon(x, y, icicle)) {
//         self.overIcicleHandler(icicle);
//       }
//     });

//     navigationIcons.onInputOver(x, y);
//     game.render.all();
//   },

//   /**
//    * Display correct answer
//    */
//   showAnswer: function () {},

//   /**
//    * Saves players data after level ends - to be sent to database <br>
//    *
//    * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
//    *
//    * @see /php/save.php
//    */
//   postScore: function () {},
// };
