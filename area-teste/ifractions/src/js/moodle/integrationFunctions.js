/*************************************************************************************
 * LInE - Free Education, Private Data - http://www.usp.br/line
 *
 * This code is used EXCLUSIVELY when iFractions is runnign inside Moodle via iAssign
 * as an iLM (interactive learning module) and the global variable moodle=true.
 *
 * More about iAssign:
 * http://200.144.254.107/git/LInE/iassign
 *
 * More about creating iLM for iAssign (and the functions in this file):
 * https://www.ime.usp.br/~igormf/ima-tutorial/ (in pt-BR)
 *
 *************************************************************************************/

/** [Functions used by iAssign]
 *
 * The iLM will be included in the HTML page as an iFrame,
 * therefore some parameters are going to be passed by the iAssign to the iLM via URL. <br>
 * This method will read these parameters.
 */
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

/** [Functions used by iAssign]
 *
 * This function is automaticaly called by iAssign in two different times: <br>
 *
 * - When a PROFESSOR finishes creating an new iLM and clicks "save". <br>
 *   Returns: the iLM created (aka the values set by the professor in text form). <br>
 *
 * - When a STUDENT finishes solving an assignment and clicks "send". <br>
 *   Returns: data about the student's progress (aka the student's progress in text form). <br>
 *
 *  @returns {string} the data that will be received by iAssign and stored on the database (a game file with extension .frc)
 */
function getAnswer() {
  let str = '';
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') {
    // Student - sending results
    str +=
      'gameName:' +
      gameName +
      '\ngameShape:' +
      gameShape +
      '\ngameMode:' +
      gameMode +
      '\ngameOperation:' +
      gameOperation +
      '\ngameDifficulty:' +
      gameDifficulty +
      '\nshowFractions:' +
      showFractions +
      '\nresults:';
    for (let i = 0; i < moodleVar.hits.length; i++) {
      str +=
        '{level=' +
        (i + 1) +
        ',hits=' +
        moodleVar.hits[i] +
        ',errors=' +
        moodleVar.errors[i] +
        ',timeElapsed=' +
        moodleVar.time[i] +
        '}';
    }
  } else {
    // Professor - creating new assignment
    if (!gameName) {
      alert(game.lang.error_must_select_game);
      return x;
    }
    moodleVar.hits = [0, 0, 0, 0];
    moodleVar.errors = [0, 0, 0, 0];
    moodleVar.time = [0, 0, 0, 0];
    str +=
      'gameName:' +
      gameName +
      '\ngameShape:' +
      gameShape +
      '\ngameMode:' +
      gameMode +
      '\ngameOperation:' +
      gameOperation +
      '\ngameDifficulty:' +
      gameDifficulty +
      '\nshowFractions:' +
      showFractions;
  }

  return str;
}

/** [Functions used by iAssign]
 *
 * This function must be present if the iMA uses automatic evaluation. <br>
 * It is is called by iAssign after the student submits a solution
 * and the data is sent to the moodle database.
 *
 * @returns {number} student's grade for the current assignment : real number between 0.0 and 1.0
 */
function getEvaluation() {
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') {
    // Student
    let i;
    for (i = 0; i < moodleVar.hits.length && moodleVar.hits[i] == 1; i++);
    const grade = i / 4;
    parent.getEvaluationCallback(grade); // Sends grade to moodle db
    return grade;
  }
}

/** [Functions used by iAssign]
 *
 * Holds the parameters passed by the iAssign to the iLM via URL.
 */
const iLMparameters = {
  /**
   * This parameter gets the role in which the iLM is being used: <br>
   * - if true, the user is creating a new iLM (as professor) <br>
   * - if false, the user is solving the iLM (as student), value=false
   */
  iLM_PARAM_SendAnswer: getParameterByName('iLM_PARAM_SendAnswer'), // Checks if you're student (false) or professor (true)
  /**
   * This parameter is used when the user is opening an iLM to solve it. <br>
   * It holds a URL with the path to the game file (assignment/iLM) created by the professor. <br>
   * Example: http://myschool.edu/moodle/mod/iassign/ilm_security.php?id=3&token=b3660dd4de0b0e9bb01fea6cc8f02ccd&view=1
   *
   * The first parameter, 'token', can be used only once.
   * Once the iLM gets the game file, the token is destroied (for security).
   */
  iLM_PARAM_Assignment: getParameterByName('iLM_PARAM_Assignment'),
  /**
   * Gets current moodle language.
   */
  lang: getParameterByName('lang'),
  iLM_PARAM_ServerToGetAnswerURL: getParameterByName(
    'iLM_PARAM_ServerToGetAnswerURL'
  ),
};

/**
 * Makes a GET request for the assignment file
 * and sends it to breakString() to treat its content.
 */
const getiLMContent = function () {
  const url = iLMparameters.iLM_PARAM_Assignment;
  if (url == null) {
    console.error(
      'Game error: iLMparameters.iLM_PARAM_Assignment empty (File with extension .frc not found).'
    );
  } else {
    const init = { method: 'GET' };
    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          if (isDebugMode) console.log('Processing...');
          response.text().then((text) => {
            breakString(text);
          }); // Sends text to be treated
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

/**
 * Receives the text from the assignment file,
 * breaks the string into a key/value
 * and sends it to updateGlobalVariables()
 * to update game variables before showing the screen.
 *
 * @param {string} text content of the .frc file
 */
const breakString = function (text) {
  let gameInfo = {},
    results;
  const lines = text.split('\n'); // Break by line

  lines.forEach((cur) => {
    try {
      let line = cur.split(':'); // Break by key:value
      if (line[0] != 'results') {
        const key = line[0].replace(/^\s+|\s+$/g, ''); // Removes end character
        const value = line[1].replace(/^\s+|\s+$/g, '');
        gameInfo[key] = value;
      } else {
        results = line[1].replace(/^\s+|\s+$/g, '');
      }
    } catch (Error) {
      console.error('Game error: sintax error.');
    }
  });

  if (results) {
    let i = 1;
    const curLevel = results.split('}'); // Remove }
    results = { l1: {}, l2: {}, l3: {}, l4: {} };

    curLevel.forEach((cur) => {
      cur = cur.slice(1); // Remove {
      cur = cur.split(','); // Break by line
      cur.forEach((cur) => {
        try {
          if (cur.length != 0) {
            let line = cur.split('='); // Break by key=value
            const key = line[0].replace(/^\s+|\s+$/g, ''); // Removes end char
            const value = line[1].replace(/^\s+|\s+$/g, ''); // Removes end char
            results['l' + i][key] = parseInt(value);
          }
        } catch (Error) {
          console.error('Game error: sintax error.');
        }
      });
      i++;
    });
  }

  updateGlobalVariables(gameInfo, results);
};

/**
 * Updates game variables before starting the activity, then: <br>
 * - calls state 'customMenu' if the assignment WAS NOT previously completed. <br>
 * - calls state 'studentReport' otherwise.
 *
 * @param {object} info game information
 * @param {undefined|object} infoResults student answer (if there is any)
 */
const updateGlobalVariables = function (infoGame, infoResults) {
  // Update game variables to content received from game file
  gameName = infoGame['gameName'];
  gameShape = infoGame['gameShape'];
  gameMode = infoGame['gameMode'];
  gameOperation = infoGame['gameOperation'];
  gameDifficulty = parseInt(infoGame['gameDifficulty']);
  showFractions = infoGame['showFractions'];
  // Update default values
  curMapPosition = 0;
  canGoToNextMapPosition = true;
  completedLevels = 0;
  // If the assignment WAS previously completed calls 'studentReport' after all is loaded.
  if (infoResults) {
    // Adds data about the student's report
    for (let i = 0; i < moodleVar.hits.length; i++) {
      moodleVar.hits[i] = infoResults['l' + (i + 1)].hits;
      moodleVar.errors[i] = infoResults['l' + (i + 1)].errors;
      moodleVar.time[i] = infoResults['l' + (i + 1)].timeElapsed;
    }
    game.state.start('studentReport');
  } else {
    // If assignment WAS NOT previously completed, calls 'customMenu' after all is loaded.
    game.state.start('customMenu');
  }
};

moodleVar = {
  hits: [0, 0, 0, 0],
  errors: [0, 0, 0, 0],
  time: [0, 0, 0, 0],
};
