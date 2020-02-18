const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current"
      }
    }
  ],
  "@babel/preset-typescript"
];
const plugins = [
  [
    "module-resolver",
    {
      extensions: [".ts"],
      root: ["./src"],
      alias: {
        "~/*": "./src"
      }
    }
  ]
];
const comments = false;
const ignore = ["./src/*/*.test.ts"];

module.exports = {
  presets,
  plugins,
  comments,
  ignore
};
