module.exports = (function(eleventyConfig) {
  const years = ["2020", "2019", "2018"];
    
  // create a collection of issues specific to each report, sorted by success criterion
  for (let i=0; i < years.length; i++) {
    eleventyConfig.addCollection(years[i], function (collectionApi) {
      return collectionApi.getFilteredByGlob(`./src/books/**/*.md`)
        .filter(item => (item.data.read === years[i]))
    });
  }

  // Base Config
  return {
    dir: {
        input: "src",
        output: "dist",
        includes: "_includes",
        layouts: "_layouts",
        data: "_data"
    },
    templateFormats: ["njk", "md", "css", "png", "jpg", "svg"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  }
});
