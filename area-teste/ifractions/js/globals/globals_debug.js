const isDebugMode = false;

const debugState = {
  lang: { skip: true, lang: 'pt_BR' },
  name: { skip: true, name: 'Username' },
  menu: { skip: false, id: 1, audioStatus: false },
  customMenu: {
    skip: false,
    getData: () => {
      return { mode: 'a', operation: 'plus', difficulty: 3, label: true };
    },
  },
  map: { skip: false },
  end: { skip: false, stop: false },
  moodle: {
    emulate: false,
    info: {
      hits: [1, 1, 1, 0],
      errors: [2, 3, 0, 4],
      time: [60, 120, 120, 2],
    },
  },
};

const debugFunctions = {
  grid: () => {
    const grid = 2;
    const h = 1920 / (grid + 0.5);
    const v = 1080 / (grid + 0.5);
    for (let i = 0; i < grid; i++) {
      game.add.geom.rect(h / 2 + i * h, 0, h / 2, 1080, colors.blue, 0.3);
      game.add.geom.rect(
        0,
        v / 2 + i * v,
        1920,
        v / 2,

        colors.blue,
        0.3
      );
    }
  },
};
