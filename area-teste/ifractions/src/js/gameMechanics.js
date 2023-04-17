/***************************************************************
 * LInE - Free Education, Private Data - http://www.usp.br/line
 *
 * This file handles all the game mechanics.
 **************************************************************/

/**
 * Variable that handles game mechanics.
 *
 * @namespace
 */
const game = {
  image: {}, // [Not directly used] Holds cached reference to media.
  sprite: {}, // [Not directly used] Holds cached reference to media.
  audio: {}, // Holds cached reference to media - game.audio.<name>.play() plays that audio once.
  lang: {}, // Holds language dictionary in a key-value format - game.lang.<key> returns <value>.

  /** 
   * Handles game states. <br>
   * 
   * When a state is associated with an object 
   * it can accessed using game.state.start('state name'). <br>

   * That way the object can use the especial functions: preload(), create() and update(); 
   * that behave according to the following rules: <br> 
   * - preload() : first function to run when a state is called. Loads media. Runs only once. (is optional) <br>
   * - create() : called right after preload(). Where the main code goes. Runs only once. (must exist) <br>
   * - update() : called right after create(). Is iteratively called by 'game loop' until going to next state. (is optional)
   *
   * @namespace 
   */
  state: {
    // [Not directly used] List of game states.
    list: [],
    // [Not directly used]
    name: undefined,
    // progressBar
    progressBar: undefined,
    progressBarLabel: undefined,
    /**
     * Create new state. <br>
     *
     * After a state is created, the object associated with that state
     * can be called using game.state.start('state name')
     *
     * @param {string} name state name
     * @param {object} obj object that should be called when accessing the state
     */
    add: function (name, obj) {
      game.state.list[name] = obj;
    },
    /**
     * Start new state.
     *
     * Will look for the state's preload() to load the files for the current state.
     * If there is no preload, will call create().
     *
     * @param {string} name state name
     */
    start: function (name) {
      document.body.style.cursor = 'auto'; // Set cursor to default
      game.loop.stop(); // Stop last game loop
      game.event.clear(); // Clears last event queue
      game.animation.clear(); // Clears last animation queue
      game.loadedCur = 0; // Clears last state's number of loaded media
      game.loadedMax = 0; // Clears last state's expected loaded media
      game.state.name = name; // Updates state name
      navigation.list = [];
      self = game.state.list[name]; // Updates self to current state
      if (self.preload) {
        game.render.clear(); // Clears render queue
        // IF there's media to be loaded, creates progress bar
        game.add.geom.rect(
          0,
          0,
          context.canvas.width,
          context.canvas.height,
          colors.blueBg,
          1
        );
        game.add.geom.rect(
          context.canvas.width / 2 - 500 / 2,
          context.canvas.height / 2 - 40 / 2,
          500,
          40,
          colors.white,
          1
        );

        game.state.progressBar = game.add.geom.rect(
          context.canvas.width / 2 - 500 / 2,
          context.canvas.height / 2,
          40,
          40,
          colors.blue,
          0.4
        );
        game.state.progressBar.anchor(0, 0.5);

        game.state.progressBarLabel = game.add.text(
          context.canvas.width / 2,
          context.canvas.height / 2 + 80,
          'Loading...',
          textStyles.h2_
        );

        // Calls state's preload() to load the state's media
        self.preload();
      } else {
        game.state.create();
      }
    },
    /**
     * [Not directly used] Encapsulate create() function in the current state.
     */
    create: function () {
      game.render.clear(); // Clears render queue, removing 'progress bar' if preload() was called
      if (!self.create) {
        console.error(
          "Game error: The state called does not have a 'create' function. Unable to continue."
        );
      } else {
        self.create(); // Calls create()
        game.render.all(); // After create() ends, renders media on canvas
        if (self?.restart) {
          // If needed, restart state
          game.state.start(game.state.name);
        } else {
          if (self.update) game.loop.start(self); // Calls update() if it exists
        }
      }
    },
  },

  loadHandler: {
    cur: 0, // [Not directly used] CURRENT number of cached media (on current state)
    max: 0, // [Not directly used] EXPECTED number of cached media (on current state)
    // [Not directly used] media type and status information
    type: {
      lang: { isLoading: false, cached: 0, length: 0 },
      audio: { isLoading: false, cached: 0, length: 0 },
      image: { isLoading: false, cached: 0, length: 0 },
      sprite: { isLoading: false, cached: 0, length: 0 },
    },
    /** [Not directly used] Removes the urls that are already in the cache.
     *
     * @param {string[]} unfilteredUrls array of urls
     * @param {object} mediaCategory media category
     *
     * @returns {string[]} array of uncached urls
     */
    getUncachedUrlsOnly: function (unfilteredUrls, mediaCategory) {
      const uncachedUrls = [];
      unfilteredUrls.forEach((url) => {
        if (mediaCategory[url[0]] === undefined) uncachedUrls.push(url);
      });
      return uncachedUrls;
    },
    /** [Not directly used] Informs ONE media file was loaded to cache. <br>
     *
     * After ALL FILES of the SAME CATEGORY are cached, calls game.load.cachedAllInOneMediaType()
     *
     * @param {String} mediaType media category (to update the cached files from that category)
     */
    cachedOneFile: function (mediaType) {
      const length = game.loadHandler.type[mediaType].length;

      // Update progress bar on loading screen
      if (length - 1 !== 0) {
        // if (game.state..progressBarLabel?.name) {
        //   game.state..progressBarLabel.name = `${game.loadHandler.cur + 1}/${
        //     game.loadHandler.max
        //   }`;
        // }
        game.state.progressBar.width =
          (500 / game.loadHandler.max) * game.loadHandler.cur;
        game.render.all();
        game.loadHandler.cur++;
        // console.log(game.loadHandler.cur, game.loadHandler.max);
      }
      // If reached last index of current media array
      if (game.loadHandler.type[mediaType].cached >= length - 1) {
        // Resets load manager
        game.loadHandler.type[mediaType].isLoading = false;
        game.loadHandler.type[mediaType].cached = 0;
        game.loadHandler.type[mediaType].length = 0;
        // Informs
        game.loadHandler.cachedAllInOneMediaType();
      } else {
        // Updates
        game.loadHandler.type[mediaType].cached++;
      }
    },
    /** [Not directly used] Informs ALL MEDIA files from the SAME CATEGORY are cached. <br>
     *
     * After ALL CATEGORIES of media are cached, calls create() via game.state. <br>
     * ATTENTION: Do not call create() directly.
     */
    cachedAllInOneMediaType: function () {
      // Checks if finished loading ALL media categories
      let endPreload = true;
      for (let key in game.loadHandler.type) {
        if (game.loadHandler.type[key].isLoading) {
          endPreload = false;
          break;
        }
      }
      // If flag doesnt change, all media is cached
      if (endPreload) {
        game.loadHandler.cur = 0;
        game.loadHandler.max = 0;
        game.state.create();
      }
    },
  },
  /**
   * Loads media files to cache. <br>
   *
   * IMPORTANT: Must ONLY be used inside the function preload(),
   * as it calls create() after all media is cached.
   *
   * @see /js/globals.js for the list of media urls (var url)
   *
   * @namespace
   */
  load: {
    /**
     * Loads language file to cache using Fetch API and
     * saves its content as dictionary on game.lang.
     *
     * @param {string} url url for the selected language
     */
    lang: function (url) {
      game.loadHandler.type.lang.isLoading = true;
      game.loadHandler.type.lang.cached = 0;

      game.lang = {}; // Clear previously loaded language

      fetch(url, { mode: 'same-origin' })
        .then((response) => response.text())
        .then((text) => {
          const lines = text.split('\n');
          game.loadHandler.type.lang.length = lines.length;
          game.loadHandler.max += lines.length;
          lines.forEach((line) => {
            try {
              const msg = line.split('=');
              if (msg.length !== 2)
                throw Error('Game error: sintax error in i18y file');
              game.lang[msg[0].trim()] = msg[1].trim();
            } catch (error) {
              console.error(error.message);
            }
            game.loadHandler.cachedOneFile('lang');
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    /**
     * Loads audio files to cache using Fetch API
     * saves references in game.audio.
     *
     * @param {string[]} urls audio urls for the current state
     */
    audio: function (urls) {
      game.loadHandler.type.audio.isLoading = true;
      game.loadHandler.type.audio.cached = 0;

      urls = game.loadHandler.getUncachedUrlsOnly(urls, game.audio);

      game.loadHandler.type.audio.length = urls.length;

      if (urls.length == 0) {
        game.loadHandler.cachedOneFile('audio');
      } else {
        game.loadHandler.max += urls.length;

        urls.forEach((url) => {
          fetch(url[1][1], { mode: 'same-origin' })
            .then((response) => response.blob())
            .then((data) => {
              game.audio[url[0]] = new Audio(URL.createObjectURL(data));
              game.loadHandler.cachedOneFile('audio');
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    },
    /**
     * Loads image files to cache using HTMLImageElement
     * saves references in game.image.
     *
     * @param {string[]} urls image urls for the current state
     */
    image: function (urls) {
      game.loadHandler.type.image.isLoading = true;
      game.loadHandler.type.image.cached = 0;

      urls = game.loadHandler.getUncachedUrlsOnly(urls, game.image);

      game.loadHandler.type.image.length = urls.length;

      if (urls.length == 0) {
        game.loadHandler.cachedOneFile('image');
      } else {
        game.loadHandler.max += urls.length;

        urls.forEach((url) => {
          const img = new Image();
          img.onload = () => {
            game.image[url[0]] = img;
            game.loadHandler.cachedOneFile('image');
          };
          img.onerror = () => {
            console.error(
              'Game error: image "' + url[0] + '" not found in sourse files.'
            );
            game.image[url[0]] = img;
            img.src = fallbackImgUrl;
            game.loadHandler.cachedOneFile('image');
          };
          img.src = url[1];
        });
      }
    },
    /**
     * Loads image files that contains spritesheets to cache using HTMLImageElement
     * saves references in game.sprite.
     *
     * @param {string[]} urls spritesheet urls for the current state
     */
    sprite: function (urls) {
      game.loadHandler.type.sprite.isLoading = true;
      game.loadHandler.type.sprite.cached = 0;

      urls = game.loadHandler.getUncachedUrlsOnly(urls, game.sprite);

      game.loadHandler.type.sprite.length = urls.length;

      if (urls.length == 0) {
        game.loadHandler.cachedOneFile('sprite');
      } else {
        game.loadHandler.max += urls.length;

        urls.forEach((url) => {
          try {
            const img = new Image();
            img.onload = () => {
              game.sprite[url[0]] = img;
              game.loadHandler.cachedOneFile('sprite');
            };
            img.onerror = () => {
              console.error('Game error: sprite not found');
              game.sprite[url[0]] = img;
              img.src = fallbackImgUrl;
              img.frames = 1;
              game.loadHandler.cachedOneFile('sprite');
            };
            img.src = url[1];
            img.frames = url[2];
          } catch (error) {
            console.error(error);
          }
        });
      }
    },
  },

  /**
   * Adds new media to the 'media queue' (game.render.queue). <br>
   *
   * All queued media will be rendered on canvas when game.render.all() is called.
   *
   * @namespace
   */
  add: {
    /**
     * Adds image to media queue.
     *
     * @param {number} x x coordinate for the figure
     * @param {number} y y coordinate for the figure
     * @param {string} img name of the cached image
     * @param {undefined|number} scale scale for the image (default = 1)
     * @param {undefined|number} alpha level of transparency, from 0 (invisible) to 1 (100% visible) (default = 1)
     *
     * @returns {object} a reference to the created image.
     */
    image: function (x, y, img, scale, alpha) {
      if (x == undefined || y == undefined || img == undefined)
        console.error('Game error: missing parameters.');
      else if (game.image[img] == undefined)
        console.error('Game error: image not found in cache: ' + img + '.');
      else {
        const med = {
          typeOfMedia: 'image',
          name: img,

          x: x || game.add.default.x,
          y: y || game.add.default.y,
          _xWithAnchor: x || game.add.default._xWithAnchor,
          _yWithAnchor: y || game.add.default._yWithAnchor,
          xAnchor: game.add.default.xAnchor,
          yAnchor: game.add.default.yAnchor,

          shadow: game.add.default.shadow,
          shadowColor: game.add.default.shadowColor,
          shadowBlur: game.add.default.shadowBlur,
          alpha: alpha != undefined ? alpha : game.add.default.alpha,

          scale: scale || game.add.default.scale,
          width: game.image[img].width,
          height: game.image[img].height,

          anchor: function (xAnchor, yAnchor) {
            this.xAnchor = xAnchor;
            this.yAnchor = yAnchor;
          },
          get xWithAnchor() {
            return this.x - this.width * this.scale * this.xAnchor;
          },
          get yWithAnchor() {
            return this.y - this.height * this.scale * this.yAnchor;
          },
        };
        med.initialScale = med.scale;
        game.render.queue.push(med);
        return med;
      }
    },
    /**
     * Adds spritesheet to media queue. <br>
     * A spritesheet is an image that can be cropped to show only one 'frame' at a time.
     *
     * @param {number} x x coordinate for the figure
     * @param {number} y Y coordinate for the figure
     * @param {string} img name of the cached spritesheet
     * @param {undefined|number} curFrame current frame (default = 0)
     * @param {undefined|number} scale scale for the spritesheet (default = 1)
     * @param {undefined|number} alpha level of transparency, from 0 (invisible) to 1 (100% visible) (default = 1)
     *
     * @returns {object} a reference to the created sprite.
     */
    sprite: function (x, y, img, curFrame, scale, alpha) {
      if (x == undefined || y == undefined || img == undefined)
        console.error('Game error: missing parameters.');
      else if (game.sprite[img] == undefined)
        console.error('Game error: sprite not found in cache: ' + img + '.');
      else {
        const med = {
          typeOfMedia: 'sprite',
          name: img,

          x: x || game.add.default.x,
          y: y || game.add.default.y,
          _xWithAnchor: x || game.add.default._xWithAnchor,
          _yWithAnchor: y || game.add.default._yWithAnchor,
          xAnchor: game.add.default.xAnchor,
          yAnchor: game.add.default.yAnchor,

          shadow: game.add.default.shadow,
          shadowColor: game.add.default.shadowColor,
          shadowBlur: game.add.default.shadowBlur,
          alpha: alpha != undefined ? alpha : game.add.default.alpha,

          scale: scale || game.add.default.scale,
          width: game.sprite[img].width / game.sprite[img].frames, // Frame width
          height: game.sprite[img].height, // Frame height

          curFrame: curFrame || 0,

          anchor: function (xAnchor, yAnchor) {
            this.xAnchor = xAnchor;
            this.yAnchor = yAnchor;
          },
          get xWithAnchor() {
            return this.x - this.width * this.scale * this.xAnchor;
          },
          get yWithAnchor() {
            return this.y - this.height * this.scale * this.yAnchor;
          },
        };
        med.initialScale = med.scale;
        game.render.queue.push(med);
        return med;
      }
    },
    /**
     * Adds text to media queue.
     *
     * @param {number} x x coordinate for the figure
     * @param {number} y y coordinate for the figure
     * @param {string} text text to be displayed on screen
     * @param {object} style object containing font, color and align for the text
     *
     * @returns {object} a reference to the created text.
     */
    text: function (x, y, text, style) {
      if (
        x == undefined ||
        y == undefined ||
        text == undefined ||
        style == undefined
      ) {
        console.error('Game error: missing parameters.');
      } else {
        const med = {
          typeOfMedia: 'text',
          name: style?.increaseLetterSpacing
            ? text.split('').join(String.fromCharCode(8202))
            : text,

          x: x || game.add.default.x,
          y: y || game.add.default.y,
          _xWithAnchor: x || game.add.default._xWithAnchor,
          _yWithAnchor: y || game.add.default._yWithAnchor,
          xAnchor: game.add.default.xAnchor,
          yAnchor: game.add.default.yAnchor,

          shadow: game.add.default.shadow,
          shadowColor: game.add.default.shadowColor,
          shadowBlur: game.add.default.shadowBlur,
          alpha: game.add.default.alpha,

          font: style.font || game.add.default.font,
          fill: style.fill || game.add.default.fill,
          align: style.align || game.add.default.align,

          anchor: function () {
            console.error("Game error: there's no anchor for text.");
          },
          set style(style) {
            this.font = style.font;
            this.fill = style.fill;
            this.align = style.align;
          },
          get xWithAnchor() {
            return this.x;
          },
          get yWithAnchor() {
            return this.y;
          },
        };
        game.render.queue.push(med);
        return med;
      }
    },
    /**
     * Adds geometric shapes.
     * @namespace
     */
    geom: {
      /**
       * Adds rectangle to media queue.
       *
       * @param {number} x x coordinate for top left corner of the rectangle
       * @param {number} y y coordinate for top left corner of the rectangle
       * @param {number} width rectangle width (default = 50)
       * @param {undefined|number} height rectangle height (default = 50)
       * @param {undefined|string} lineColor stroke color (default = black)
       * @param {undefined|number} lineWidth stroke width (default = 1px)
       * @param {undefined|string} fillColor fill color (default = no fill)
       * @param {undefined|number} alpha level of transparency, from 0 (invisible) to 1 (100% visible)) (default = 1)
       *
       * @returns {object} a reference to the created rectangle.
       */
      rect: function (
        x,
        y,
        width,
        height,
        fillColor,
        alpha,
        lineColor,
        lineWidth
      ) {
        if (x == undefined || y == undefined || width == undefined)
          console.error('Game error: missing parameters.');
        else {
          const med = {
            typeOfMedia: 'rect',

            x: x || game.add.default.x,
            y: y || game.add.default.y,
            _xWithAnchor: x || game.add.default._xWithAnchor,
            _yWithAnchor: y || game.add.default._yWithAnchor,
            xAnchor: game.add.default.xAnchor,
            yAnchor: game.add.default.yAnchor,

            shadow: game.add.default.shadow,
            shadowColor: game.add.default.shadowColor,
            shadowBlur: game.add.default.shadowBlur,
            alpha: alpha != undefined ? alpha : game.add.default.alpha,

            scale: game.add.default.scale,

            width: 0,
            height: 0,

            lineColor: lineColor || game.add.default.lineColor,
            lineWidth: 0,
            fillColor: fillColor || game.add.default.fillColor,

            anchor: function (xAnchor, yAnchor) {
              this.xAnchor = xAnchor;
              this.yAnchor = yAnchor;
            },
            get xWithAnchor() {
              return this.x - this.width * this.scale * this.xAnchor;
            },
            get yWithAnchor() {
              return this.y - this.height * this.scale * this.yAnchor;
            },
          };
          med.initialScale = med.scale;
          if (width != 0) {
            med.width = width || game.add.default.width;
          }
          if (height != 0) {
            med.height = height || width || game.add.default.height;
          }
          if (lineWidth != 0) {
            med.lineWidth = lineWidth || game.add.default.lineWidth;
          }
          game.render.queue.push(med);
          return med;
        }
      },
      /**
       * Adds circle to media queue.
       *
       * @param {number} x x coordinate for the circle center
       * @param {number} y y coordinate for the circle center
       * @param {number} diameter circle diameter (default = 50)
       * @param {undefined|string} lineColor stroke color (default = black)
       * @param {undefined|number} lineWidth stroke width (default = 1px)
       * @param {undefined|string} fillColor fill color (default = no fill)
       * @param {undefined|number} alpha level of transparency, from 0 (invisible) to 1 (100% visible)) (default = 1)
       *
       * @returns {object} a reference to the created circle.
       */
      circle: function (
        x,
        y,
        diameter,
        lineColor,
        lineWidth,
        fillColor,
        alpha
      ) {
        if (x == undefined || y == undefined || diameter == undefined)
          console.error('Game error: missing parameters.');
        else {
          const med = {
            typeOfMedia: 'arc',

            x: x || game.add.default.x,
            y: y || game.add.default.y,
            _xWithAnchor: x || game.add.default._xWithAnchor,
            _yWithAnchor: y || game.add.default._yWithAnchor,
            xAnchor: game.add.default.xAnchor,
            yAnchor: game.add.default.yAnchor,

            shadow: game.add.default.shadow,
            shadowColor: game.add.default.shadowColor,
            shadowBlur: game.add.default.shadowBlur,
            alpha: alpha != undefined ? alpha : game.add.default.alpha,

            scale: game.add.default.scale,

            diameter: 0,

            width: 0,
            height: 0,

            angleStart: 0,
            angleEnd: 2 * Math.PI,
            counterclockwise: game.add.default.counterclockwise,

            lineColor: lineColor || game.add.default.lineColor,
            lineWidth: 0,
            fillColor: fillColor || game.add.default.fillColor,

            anchor: function (xAnchor, yAnchor) {
              this.xAnchor = xAnchor;
              this.yAnchor = yAnchor;
            },
            get xWithAnchor() {
              return this.x - this.width * this.scale * this.xAnchor;
            },
            get yWithAnchor() {
              return this.y - this.height * this.scale * this.yAnchor;
            },
          };
          med.initialScale = med.scale;
          if (diameter != 0) {
            med.diameter = diameter || game.add.default.diameter;
            med.width = med.height = med.diameter;
          }
          if (lineWidth != 0) {
            med.lineWidth = lineWidth || game.add.default.lineWidth;
          }
          game.render.queue.push(med);
          return med;
        }
      },
      /**
       * Adds arc to media queue.
       *
       * @param {number} x x coordinate for the arc center
       * @param {number} y y coordinate for the arc center
       * @param {number} diameter arc diameter
       * @param {number} angleStart angle to start the arc
       * @param {number} angleEnd angle to end the arc
       * @param {undefined|boolean} counterclockwise if true, arc is created counterclockwise (default = false)
       * @param {undefined|string} lineColor stroke color (default = black)
       * @param {undefined|number} lineWidth stroke width (default = 1px)
       * @param {undefined|string} fillColor fill color (default = no fill)
       * @param {undefined|number} alpha level of transparency, from 0 (invisible) to 1 (100% visible)) (default = 1)
       *
       * @returns {object} a reference to the created arc.
       */
      arc: function (
        x,
        y,
        diameter,
        angleStart,
        angleEnd,
        counterclockwise,
        lineColor,
        lineWidth,
        fillColor,
        alpha
      ) {
        if (
          x == undefined ||
          y == undefined ||
          diameter == undefined ||
          angleStart == undefined ||
          angleEnd == undefined
        )
          console.error('Game error: missing parameters.');
        else {
          const med = {
            typeOfMedia: 'arc',

            x: x || game.add.default.x,
            y: y || game.add.default.y,
            _xWithAnchor: x || game.add.default._xWithAnchor,
            _yWithAnchor: y || game.add.default._yWithAnchor,
            xAnchor: game.add.default.xAnchor,
            yAnchor: game.add.default.yAnchor,

            shadow: game.add.default.shadow,
            shadowColor: game.add.default.shadowColor,
            shadowBlur: game.add.default.shadowBlur,
            alpha: alpha != undefined ? alpha : game.add.default.alpha,

            scale: game.add.default.scale,

            diameter: 0,

            width: 0,
            height: 0,

            angleStart: angleStart || 0,
            angleEnd: angleEnd || 2 * Math.PI,
            counterclockwise:
              counterclockwise || game.add.default.counterclockwise,

            lineColor: lineColor || game.add.default.lineColor,
            lineWidth: 0,
            fillColor: fillColor || game.add.default.fillColor,

            anchor: function (xAnchor, yAnchor) {
              this.xAnchor = xAnchor;
              this.yAnchor = yAnchor;
            },
            get xWithAnchor() {
              return this.x - this.width * this.scale * this.xAnchor;
            },
            get yWithAnchor() {
              return this.y - this.height * this.scale * this.yAnchor;
            },
          };
          med.initialScale = med.scale;
          if (diameter != 0) {
            med.diameter = diameter || game.add.default.diameter;
            med.width = med.height = med.diameter;
          }
          if (lineWidth != 0) {
            med.lineWidth = lineWidth || game.add.default.lineWidth;
          }
          game.render.queue.push(med);
          return med;
        }
      },
    },
    /**
     * [Not directly used] Default values for the media properties.
     */
    default: {
      // Used in: all types of media.
      x: 0,
      y: 0,
      _xWithAnchor: 0,
      _yWithAnchor: 0,
      xAnchor: 0,
      yAnchor: 0,
      shadow: false,
      shadowColor: '#0075c5',
      shadowBlur: 20,
      alpha: 1,
      // Used in: image, sprite, square, circle.
      scale: 1,
      // Used in: text.
      font: '14px Arial,sans-serif',
      fill: '#000',
      align: 'center',
      // Used in: square, circle (image and sprite have width and height, but do not have default values).
      width: 50,
      height: 50,
      lineColor: '#000',
      lineWidth: 0, // No line
      fillColor: '#fff', // white fill
      // Used in: circle.
      diameter: 50,
      counterclockwise: false,
    },
  },

  /**
   * Renders media on current screen. <br<
   * It uses properties of html canvas to draw media on screen during game loop.
   *
   * @namespace
   */
  render: {
    // [Not directly used] Media queue to be rendered on the current state.
    queue: [],
    /** [Not directly used] Renders image on canvas.
     *
     * @param {object} cur current media in media queue
     */
    image: function (cur) {
      const x = cur.xWithAnchor,
        y = cur.yWithAnchor;
      // Rotation
      if (cur.rotate && cur.rotate != 0) {
        context.save();
        context.translate(cur.x, cur.y);
        context.rotate((cur.rotate * Math.PI) / 180);
        context.translate(-cur.x, -cur.y);
      }
      // Alpha
      context.globalAlpha = cur.alpha;
      // Shadow
      context.shadowBlur = cur.shadow ? cur.shadowBlur : 0;
      context.shadowColor = cur.shadowColor;
      // Image
      context.drawImage(
        game.image[cur.name],
        x,
        y,
        cur.width * cur.scale,
        cur.height * cur.scale
      );
      // End
      context.shadowBlur = 0;
      context.globalAlpha = 1;
      if (cur.rotate && cur.rotate != 0) context.restore();
    },
    /** [Not directly used] Renders spritesheet on canvas.
     *
     * @param {object} cur current media in media queue
     */
    sprite: function (cur) {
      const x = cur.xWithAnchor,
        y = cur.yWithAnchor;
      // Rotation
      if (cur.rotate && cur.rotate != 0) {
        context.save();
        context.translate(cur.x, cur.y);
        context.rotate((cur.rotate * Math.PI) / 180);
        context.translate(-cur.x, -cur.y);
      }
      // Alpha
      context.globalAlpha = cur.alpha;
      // Shadow
      context.shadowBlur = cur.shadow ? cur.shadowBlur : 0;
      context.shadowColor = cur.shadowColor;
      // Image
      context.drawImage(
        game.sprite[cur.name],
        cur.width * cur.curFrame,
        0,
        cur.width,
        cur.height,
        x,
        y,
        cur.width * cur.scale,
        cur.height * cur.scale
      );
      // End
      context.shadowBlur = 0;
      context.globalAlpha = 1;
      if (cur.rotate && cur.rotate != 0) context.restore();
    },
    /** [Not directly used] Renders text on canvas.
     *
     * @param {object} cur current media in media queue
     */
    text: function (cur) {
      const x = cur.xWithAnchor,
        y = cur.yWithAnchor;
      // Rotation
      if (cur.rotate && cur.rotate != 0) {
        context.save();
        context.translate(cur.x, cur.y);
        context.rotate((cur.rotate * Math.PI) / 180);
        context.translate(-cur.x, -cur.y);
      }
      // Alpha
      context.globalAlpha = cur.alpha;
      // Shadow
      context.shadowBlur = cur.shadow ? cur.shadowBlur : 0;
      context.shadowColor = cur.shadowColor;
      // Font style
      context.font = cur.font;
      context.textAlign = cur.align;
      context.fillStyle = cur.fill;
      // Text
      context.fillText(cur.name, x, y);
      // End
      context.shadowBlur = 0;
      context.globalAlpha = 1;
      if (cur.rotate && cur.rotate != 0) context.restore();
    },
    /** [Not directly used] Renders geometric shapes on canvas.
     *
     * @namespace
     */
    geom: {
      /**
       * Renders rectangle on canvas.
       *
       * @param {object} cur current media in media queue
       */
      rect: function (cur) {
        const x = cur.xWithAnchor,
          y = cur.yWithAnchor;
        // Rotation
        if (cur.rotate && cur.rotate != 0) {
          context.save();
          context.translate(cur.x, cur.y);
          context.rotate((cur.rotate * Math.PI) / 180);
          context.translate(-cur.x, -cur.y);
        }
        // Alpha
        context.globalAlpha = cur.alpha;
        // Shadow
        context.shadowBlur = cur.shadow ? cur.shadowBlur : 0;
        context.shadowColor = cur.shadowColor;
        // Fill
        if (cur.fillColor !== 'transparent') {
          context.fillStyle = cur.fillColor;
          context.fillRect(x, y, cur.width * cur.scale, cur.height * cur.scale);
        }
        // Stroke
        if (cur.lineWidth != 0) {
          context.strokeStyle = cur.lineColor;
          context.lineWidth = cur.lineWidth;
          context.strokeRect(
            x,
            y,
            cur.width * cur.scale,
            cur.height * cur.scale
          );
        }
        // End
        context.shadowBlur = 0;
        context.globalAlpha = 1;
        if (cur.rotate && cur.rotate != 0) context.restore();
      },
      /**
       * Renders arc on canvas (arc or circle).
       *
       * @param {object} cur current media in media queue
       */
      arc: function (cur) {
        const x = cur.xWithAnchor,
          y = cur.yWithAnchor;
        // Rotation
        if (cur.rotate && cur.rotate != 0) {
          context.save();
          context.translate(cur.x, cur.y);
          context.rotate((cur.rotate * Math.PI) / 180);
          context.translate(-cur.x, -cur.y);
        }
        // Alpha
        context.globalAlpha = cur.alpha;
        // Shadow
        context.shadowBlur = cur.shadow ? cur.shadowBlur : 0;
        context.shadowColor = cur.shadowColor;
        // Fill info
        if (cur.fillColor != 0) context.fillStyle = cur.fillColor;
        // Stroke info
        if (cur.lineWidth != 0) {
          context.strokeStyle = cur.lineColor;
          context.lineWidth = cur.lineWidth;
        }
        // Path
        context.beginPath();
        if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
        context.arc(
          x,
          y,
          (cur.diameter / 2) * cur.scale,
          cur.angleStart,
          cur.angleEnd,
          cur.counterclockwise
        );
        if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
        // End
        if (cur.fillColor != 0) context.fill();
        if (cur.lineWidth != 0) context.stroke();
        context.shadowBlur = 0;
        context.globalAlpha = 1;
        if (cur.rotate && cur.rotate != 0) context.restore();
      },
    },
    /**
     * Renders all queued media on screen. Called repeatedly by the game loop.
     */
    all: function () {
      game.render.queue.forEach((cur) => {
        switch (cur.typeOfMedia) {
          case 'image':
            this.image(cur);
            break;
          case 'sprite':
            this.sprite(cur);
            break;
          case 'text':
            this.text(cur);
            break;
          case 'rect':
            this.geom.rect(cur);
            break;
          case 'arc':
            this.geom.arc(cur);
            break;
        }
      });
    },
    /**
     * Clears media queue (used when changing states).
     */
    clear: function () {
      game.render.queue = [];
    },
  },

  /**
   * Math functions.
   *
   * @namespace
   */
  math: {
    /**
     * Returns a random integer in a range (inclusive for min and max).
     *
     * @param {number} min smaller integer
     * @param {number} max larger integer
     *
     * @returns {number} random integer in range
     */
    randomInRange: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * Returns a random divisor for a given number.
     *
     * @param {number} number number
     *
     * @returns {number} random divisor for that number
     */
    randomDivisor: function (number) {
      const validDivisors = [];
      // If 'number' can be divided by 'i', add to list of 'validDivisors'
      for (let i = 2; i < number; i++) {
        if (number % i == 0) validDivisors.push(i);
      }
      const randIndex = game.math.randomInRange(0, validDivisors.length - 1);
      return validDivisors[randIndex];
    },
    /**
     * Converts degree to radian.
     *
     * @param {number} degree number in degrees
     *
     * @returns {number} its radian equivalent
     */
    degreeToRad: function (degree) {
      return (degree * Math.PI) / 180;
    },
    getRadiusFromCircunference: function (circunference) {
      return circunference / (2 * Math.PI);
    },
    /**
     * Returns distance from the center of an icon to mouse/pointer (radius).
     *
     * @param {number} xMouse mouse x coordinate
     * @param {number} xIcon icon x coordinate
     * @param {number} yMouse mouse y coordinate
     * @param {number} yIcon icon y coordinate
     *
     * @returns {number} distance between the two icons
     */
    distanceToPointer: function (xMouse, xIcon, yMouse, yIcon) {
      const a = Math.max(xMouse, xIcon) - Math.min(xMouse, xIcon);
      const b = Math.max(yMouse, yIcon) - Math.min(yMouse, yIcon);
      return Math.sqrt(a * a + b * b);
    },
    mdc: function (num1, num2) {
      if (num2 === 0) return num1;
      return game.math.mdc(num2, num1 % num2);
    },
    mmcArray: (input) => {
      if (toString.call(input) !== '[object Array]') return false;
      var len, a, b;
      len = input.length;
      if (!len) {
        return null;
      }
      a = input[0];
      for (var i = 1; i < len; i++) {
        b = input[i];
        a = game.math.mmcTwoNumbers(a, b);
      }
      return a;
    },
    mmcTwoNumbers: (num1, num2) => {
      var resto, x, y;
      x = num1;
      y = num2;
      while (resto != 0) {
        resto = x % y;
        x = y;
        y = resto;
      }
      return (num1 * num2) / x;
    },
    getFractionFromDecimal: function (fraction) {
      const len = fraction.toString().length - 2;

      let denominator = Math.pow(10, len);
      let numerator = fraction * denominator;

      const divisor = game.math.greatestCommonDivisor(numerator, denominator);

      numerator /= divisor;
      denominator /= divisor;

      return {
        string: Math.floor(numerator) + '/' + Math.floor(denominator),
        numerator: Math.floor(numerator),
        denominator: Math.floor(denominator),
      };
    },
    /**
     * Checks if pointer/mouse is over (rectangular) icon.
     *
     * @param {number} xMouse contains the mouse x coordinate
     * @param {number} yMouse contains the mouse y coordinate
     * @param {object} icon icon
     *
     * @returns {boolean} true if cursor is over icon
     */
    isOverIcon: function (xMouse, yMouse, icon) {
      const x = xMouse,
        y = yMouse,
        cur = icon;
      return (
        y >= cur.yWithAnchor &&
        y <= cur.yWithAnchor + cur.height * cur.scale &&
        x >= cur.xWithAnchor &&
        x <= cur.xWithAnchor + cur.width * cur.scale
      );
    },
    /**
     * Checks if 2 images overlap
     *
     * @param {object} imageA image 1
     * @param {object} imageB image 2
     *
     * @returns {boolean} true if there is overlap
     */
    isOverlap: function (imageA, imageB) {
      const xA = imageA.x;
      const xB = imageB.x;

      // Consider it comming from both sides
      return !(Math.abs(xA - xB) > 14);
    },
    /**
     * Get mouse position coordinates
     *
     * @param {object} mouseEvent
     * @returns {object} x and y mouse coordinates
     */
    getMouse: function (mouseEvent) {
      const c = context.canvas.getBoundingClientRect();
      const canvas_scale = context.canvas.width / parseFloat(c.width);
      return {
        x: (mouseEvent.clientX - c.left) * canvas_scale,
        y: (mouseEvent.clientY - c.top) * canvas_scale,
      };
    },
    /**
     * Calculate spacing for icons on the menu screen
     *
     * @param {number} width width of the desirable part of the screen
     * @param {number} numberOfIcons number or icons to be put on the screen
     *
     * @returns {number} correct spacing between icons
     */
    getOffset: function (width, numberOfIcons) {
      return width / (numberOfIcons + 1);
    },
    /**
     * Converts a given time in seconds (number) to the format HH:MM:SS (string)
     *
     * @param {number} s time in seconds
     *
     * @returns {string} time in the format HH:MM:SS
     */
    convertTime: function (s) {
      let h = 0,
        m = 0;
      if (s > 1200) {
        h = s / 1200;
        s = s % 1200;
      }
      if (s > 60) {
        m = s / 60;
        s = s % 60;
      }
      h = '' + h;
      m = '' + m;
      s = '' + s;
      if (h.length < 2) h = '0' + h;
      if (m.length < 2) m = '0' + m;
      if (s.length < 2) s = '0' + s;
      return h + ':' + m + ':' + s;
    },
  },

  /**
   * Timer used to get the time spent to complete a game.
   *
   * @namespace
   */
  timer: {
    // [Not directly used] Start time.
    _start: 0,
    // [Not directly used] End time.
    end: 0,
    // Elapsed time.
    elapsed: 0,
    /**
     * Reset values and start timer.
     */
    start: function () {
      game.timer._start = game.timer.end = game.timer.elapsed = 0;
      game.timer._start = new Date().getTime();
    },
    /**
     * Stop timer and set elapsed time.
     */
    stop: function () {
      if (game.timer._start != 0 && game.timer.end == 0) {
        // If timer has started but not finished
        game.timer.end = new Date().getTime();
        game.timer.elapsed = Math.floor(
          (game.timer.end - game.timer._start) / 1000
        );
      }
    },
  },

  /**
   * Handles pointer events. <br>
   *
   * @namespace
   */
  event: {
    // [Not directly used] List of events in current state.
    list: [],
    /**
     * Adds new event to current state.
     *
     * @param {string} name event name, can be: 'click' or 'mousemove'
     * @param {function} func function to be called when event is triggered
     */
    add: function (name, func) {
      context.canvas.addEventListener(name, func);
      game.event.list.push([name, func]);
    },
    /** [Not directly used] Clears list of events. Called before moving to new state.
     */
    clear: function () {
      game.event.list.forEach((cur) => {
        context.canvas.removeEventListener(cur[0], cur[1]);
      });
      game.event.list = [];
    },
  },

  /** [Not directly used] Handles 'game loop'. <br>
   *
   * After the media queue is filled in create(), the 'game loop' starts.
   * It calls update() iteratively, re-rendering the screen every time. <br>
   *
   * The 'game loop' is stoped by leaving the current state.
   *
   * @namespace
   */
  loop: {
    // [Not directly used] Holds animation event.
    id: undefined,
    // [Not directly used] State that called the loop.
    curState: undefined,
    // [Not directly used] Loop status, can be: 'on', 'ending' or 'off'.
    status: 'off',
    // [Not directly used]
    waitingToStart: undefined,
    // [Not directly used]
    startTime: 0,
    // [Not directly used] 1000: 1 second | 60: expected frames per second.
    duration: 1000 / 60,
    /** [Not directly used] Starts game loop.
     *
     * @param {object} state current state
     */
    start: function (state) {
      if (game.loop.status == 'off') {
        game.loop.curState = state;
        game.loop.startTime = new Date().getTime();
        game.loop.status = 'on';
        game.loop.id = requestAnimationFrame(game.loop.run);
      } else {
        // If 'game.loop.status' is either 'on' or 'ending'
        game.loop.waitingToStart = state;
        if (game.loop.status == 'on') game.loop.stop();
      }
    },
    /**
     * [Not directly used] Stops game loop.
     */
    stop: function () {
      if (game.loop.status == 'on') game.loop.status = 'ending';
    },
    /**
     * [Not directly used] Executes game loop.
     *
     * This code will run on each iteration of the game loop.
     */
    run: function () {
      if (game.loop.status != 'on') {
        game.loop.clear();
      } else {
        const timestamp = new Date().getTime();
        const runtime = timestamp - game.loop.startTime;
        if (runtime >= game.loop.duration) {
          // Calls state's update()
          game.loop.curState.update();
          // Updates state's animation
          game.animation.run();
        }
        game.loop.id = requestAnimationFrame(game.loop.run); // Loop
      }
    },
    /**
     * [Not directly used] Resets game loop values.
     */
    clear: function () {
      if (game.loop.id != undefined) {
        cancelAnimationFrame(game.loop.id); // Cancel animation event
        game.loop.id = undefined; // Clears object that holds animation event
        game.loop.curState = undefined; // Clears object that holds current state
        game.loop.status = 'off'; // Inform animation must end (read in game.loop.run())
      }
      if (game.loop.waitingToStart != undefined) {
        const temp = game.loop.waitingToStart;
        game.loop.waitingToStart = undefined;
        game.loop.start(temp);
      }
    },
  },

  /**
   * Handles spritesheet animation. <br>
   * It iterates through the spritesheet frames inside the animation queue.
   * Called by game loop.
   *
   * @namespace
   */
  animation: {
    // [Not directly used] Animation queue for the current state.
    queue: [],
    // [Not directly used]
    count: 0,
    /**
     * Plays animation.
     *
     * @param {string} name animation name (identifier)
     */
    play: function (name) {
      let newAnimation;
      // Gets first object in the 'render queue' with that animation name
      for (let i in game.render.queue) {
        if (
          game.render.queue[i].animation != undefined &&
          game.render.queue[i].animation[0] == name
        ) {
          newAnimation = game.render.queue[i];
          break;
        }
      }
      // If found, saves object in the 'animation queue'
      if (newAnimation != undefined) game.animation.queue.push(newAnimation);
    },
    /**
     * Stops animation.
     *
     * @param {string} name animation name
     */
    stop: function (name) {
      // Removes all with that name from the 'animation queue'
      game.animation.queue.forEach((cur) => {
        if (cur.animation[0] == name) {
          game.animation.queue.splice(cur, 1);
        }
      });
    },
    /**
     * [Not directly used] Executes animation.
     */
    run: function () {
      game.animation.queue.forEach((character) => {
        if (
          !character.animation[2] ||
          game.animation.count % character.animation[2] == 0
        ) {
          const i = character.animation[1].indexOf(character.curFrame);
          if (i == -1) {
            // Frame not found
            if (isDebugMode)
              console.error('Game error: animation frame not found.');
          } else if (i < character.animation[1].length - 1) {
            // Go to next frame
            character.curFrame = character.animation[1][i + 1];
          } else {
            character.curFrame = character.animation[1][0]; // If last frame, restart
          }
        }
      });
      game.animation.count++;
    },
    /**
     * [Not directly used] Clears animation queue.
     */
    clear: function () {
      // Resets animation counter
      game.animation.count = 0;
      // Clears property 'animation' from objects in game.render.queue
      game.render.queue.forEach((cur) => {
        if (cur.animation != undefined) {
          delete cur.animation;
        }
      });
      // Clears animation queue
      game.animation.queue = [];
    },
  },
};
