module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react", "jsx-a11y", "import", "react-hooks"],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-console": 2,
    "react-hooks/rules-of-hooks": "error", // Vérifie les règles des Hooks
    "react-hooks/exhaustive-deps": "warn"  // Vérifie les tableaux de dépendances
  }
};
