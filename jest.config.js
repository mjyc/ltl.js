module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "**/specs/*.+(ts|tsx|js)"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
      diagnostics: true,
    }
  },
}
