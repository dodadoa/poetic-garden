module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the rule that handles JS files
      const babelLoaderRule = webpackConfig.module.rules.find(
        (rule) => rule.oneOf
      );

      if (babelLoaderRule) {
        // Add tone and three packages to be transpiled
        const jsRule = babelLoaderRule.oneOf.find(
          (rule) =>
            rule.test &&
            rule.test.toString().includes('jsx') &&
            rule.loader &&
            rule.loader.includes('babel-loader')
        );

        if (jsRule) {
          // Remove the exclude rule for node_modules for specific packages
          jsRule.include = undefined;
          jsRule.exclude = /node_modules\/(?!(tone|three-mesh-bvh|three-stdlib|@react-three)\/).*/;
        }
      }

      // Add rule to handle ES modules properly
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
};
