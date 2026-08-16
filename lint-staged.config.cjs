 module.exports = {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.vue": ["eslint --fix", "stylelint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix", "prettier --write"],
    "*.{html,json,md}": ["prettier --write"],
  };
