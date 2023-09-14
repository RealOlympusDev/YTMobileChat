// create a plugins/withFastImageWebPSupportAndroid.js - This is for `<FastImage />` Support
// note that this will need withAnimatedWebPSupport, because I've replaced it in that if-condition. Feel free to customize if you only want webP with FastImage

const {
    withAppBuildGradle,
} = require("@expo/config-plugins");


const withCustomAppBuildGradle = (config) => {
    const insertString = `implementation "com.github.zjupure:webpdecoder:2.1.${GLIDE_VERSION}"`;
    return withAppBuildGradle(config, (config) => {
        if (
            config.modResults.contents.includes(
                insertString
            )
        ) {
            return config;
        }

        config.modResults.contents = config.modResults.contents.replace(
            `if (isWebpAnimatedEnabled) {`,
            `if (isWebpAnimatedEnabled) {
            ${insertString}`
        );
        return config;
    });
};

module.exports = function withFastImageWebPSupportAndroid(config) {
    config = withCustomAppBuildGradle(config);
    return config;
};