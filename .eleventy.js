const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = (function(eleventyConfig) {
  const years = ["2020", "2019", "2018", "2017"];
    
  // create a collection of issues specific to each report, sorted by success criterion
  for (let i=0; i < years.length; i++) {
    eleventyConfig.addCollection(years[i], function (collectionApi) {
      return collectionApi.getFilteredByGlob(`./src/books/**/*.md`)
        .filter(item => (item.data.read === years[i]))
    });
  }

 eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async function(src, alt, sizes = "100vw") {
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, {
      widths: [160, 320, 640],
      formats: ['webp', 'jpeg'],
      outputDir: "dist/covers/",
      urlPath: "./dist/covers/",
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);

        return `${name}-${width}w.${format}`;
      }
    });

    let lowsrc = metadata.jpeg[0];

    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          src="${lowsrc.url}"
          width="${lowsrc.width}"
          height="${lowsrc.height}"
          alt="${alt}">
      </picture>`;
  });

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
