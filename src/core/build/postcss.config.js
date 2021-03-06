require("ts-node/register");

const kebabCase = require("lodash/kebabCase");
const mapKeys = require("lodash/mapKeys");
const mapValues = require("lodash/mapValues");
const pickBy = require("lodash/pickBy");
const flat = require("flat");
const paths = require("./paths").default;
const autoprefixer = require("autoprefixer");
const postcssCalcFunction = require("postcss-calc-function").default;
const postcssFontMagician = require("postcss-font-magician");
const postcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const postcssPresetEnv = require("postcss-preset-env");
const postcssNested = require("postcss-nested");
const postcssImport = require("postcss-import");
const postcssMixins = require("postcss-mixins");
const postcssPrependImports = require("postcss-prepend-imports");
const postcssAdvancedVariables = require("postcss-advanced-variables");

delete require.cache[paths.appThemeVariables];
const variables = require(paths.appThemeVariables).default;
const flatKebabVariables = mapKeys(
  mapValues(flat(variables, { delimiter: "-" }), (v) => v.toString()),
  (_, k) => kebabCase(k)
);

// These are sass style variables used in media queries.
const mediaQueryVariables = mapValues(
  pickBy(flatKebabVariables, (v, k) => k.startsWith("breakpoints-")),
  // Add unit to breakpoints.
  // Add 1 to support mobile first approach where we start
  // with the smallest screen and gradually add styling for the
  // next bigger screen. This is realized using `min-width` without
  // ever using `max-width`.
  (v) => `${Number.parseInt(v, 10) + 1}px`
);

module.exports = {
  // Necessary for external CSS imports to work
  // https://github.com/facebookincubator/create-react-app/issues/2677
  ident: "postcss",
  plugins: [
    // This allows us to define dynamic css variables.
    postcssPrependImports({
      path: "",
      files: [paths.appThemeMixinsCSS],
    }),
    // Needed by above plugin.
    postcssImport(),
    // Support mixins.
    postcssMixins(),
    // Support nesting.
    postcssNested(),
    // Sass style variables to be used in media queries.
    postcssAdvancedVariables({ variables: mediaQueryVariables }),
    // Reduce some calc()
    postcssCalcFunction(),
    // Provides a modern CSS environment.
    postcssPresetEnv(),
    // Does all the font handling logic.
    postcssFontMagician(),
    // Fix known flexbox bugs.
    postcssFlexbugsFixes,
    // Vendor prefixing.
    autoprefixer({
      flexbox: "no-2009",
    }),
  ],
};
