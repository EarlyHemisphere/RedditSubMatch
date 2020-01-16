module.exports = {
    "roots": [
        "<rootDir>/src/app/tests",
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleDirectories": ["node_modules", "bower_components", "src", "src/app"],
    "moduleFileExtensions": ["js", "jsx", "ts", "tsx"],

    // "jest": {
    //     "moduleFileExtensions": ["js", "jsx", "ts", "tsx"],
    //     "moduleDirectories": ["node_modules", "bower_components", "src"],
    // }
}