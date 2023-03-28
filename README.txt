ChatApp

use npm i react-native-dotenv to install and use environment values
Add plugins in your babel.config.js file

presets: ['babel-preset-expo'],
plugins: [
    ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
    }]
]

rename example.env to .env and replace the values with your firebase configuration without "".


