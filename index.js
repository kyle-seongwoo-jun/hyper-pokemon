const fs = require("fs");
const { getAverageColor } = require("fast-average-color-node");

function getRandomFile(dir) {
  var files = fs
    .readdirSync(dir)
    .filter((name) => name.match(/[.jpg|.png|.gif]$/i));

  var i = Math.floor(Math.random() * files.length);
  return dir + "/" + files[i];
}

function css(file) {
  return `
    .terms_terms {
      background-image: url("file://${file}");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  `;
}

exports.middleware = (store) => (next) => (action) => {
  if (action.type === "CONFIG_LOAD" || action.type === "CONFIG_RELOAD") {
    const { config } = action;
    if (!config.pokemon || !config.pokemon.folder) {
      return next(action);
    }

    const file = getRandomFile(config.pokemon.folder);
    getAverageColor(file, { algorithm: "dominant" }).then((result) => {
      store.dispatch({
        type: "SET_BACKGROUND_IMAGE",
        backgroundColor: result.hex,
        backgroundImage: file,
      });
    });
  }

  return next(action);
};

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case "SET_BACKGROUND_IMAGE":
      return state
        .set("css", css(action.backgroundImage))
        .set("backgroundColor", action.backgroundColor)
        .set("borderColor", action.backgroundColor);
  }
  return state;
};

exports.getTermProps = (uid, parentProps, props) => {
  props.backgroundColor = "rgba(0,0,0,0)";
  return props;
};
