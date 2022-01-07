const fs = require("fs");

function getRandomFile(dir) {
  var files = fs
    .readdirSync(dir)
    .filter((name) => name.match(/[.jpg|.png|.gif]$/i));

  var i = Math.floor(Math.random() * files.length);
  return dir + "/" + files[i];
}

async function css(config) {
  if (!config.pokemon.folder) return config.css;

  var file = getRandomFile(config.pokemon.folder);
  return `
    ${config.css || ""}
    .terms_terms {
      background-image: url("file://${file}");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  `;
}

exports.decorateConfig = (config) => {
  if (!config.pokemon) return config;

  return Object.assign({}, config, {
    css: css(config),
  });
};

exports.getTermProps = (uid, parentProps, props) => {
  props.backgroundColor = "rgba(0,0,0,0)";
  return props;
};
