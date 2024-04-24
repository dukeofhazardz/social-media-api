module.exports = {
    roots: ["<rootDir>/__tests__"],
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    // Add any other necessary configurations here
  };
  