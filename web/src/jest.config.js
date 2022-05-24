module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    modulePathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/.build/", "<rootDir>/node_modules/", "<rootDir>/public/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node" ],
    globals: {
        // we must specify a custom tsconfig for tests because we need the typescript transform
        // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
        // can see this setting in tsconfig.jest.json -> "jsx": "react"
        "ts-jest": {
            tsconfig: "tsconfig.jest.json",
        },
    },
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>$1",
    },
};
