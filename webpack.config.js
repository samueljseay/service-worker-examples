var path = require("path");

const serviceWorkerName = "service-worker-1.js";

module.exports = {
  entry: {
    main: "./src/index.js",
    sw: `./src/lib/${serviceWorkerName}`,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  output: {
    filename: "[name].js",
    path: __dirname + "/public",
  },

  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
  },
};
