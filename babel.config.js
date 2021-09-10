module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo"
    ],
    "plugins": [
      ["module:react-native-dotenv", {
        "moduleName": "react-native-dotenv",
        "path": ".env",
        "allowlist": null,
        "blocklist": null,
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }]
    ]
  };
};
