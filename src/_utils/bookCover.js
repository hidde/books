const fs = require("fs"); 
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = async function(src, alt, sizes = "100vw") {
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    if (! fs.existsSync(src)) {
      console.error(`ERROR - ${src} does not exist`);
      return false
    }

    let metadata = await Image(src, {
      widths: [160, 320, 640],
      formats: ['webp', 'jpeg'],
      outputDir: "dist/covers/",
      urlPath: "/covers/",
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);

        return `${name}-${width}w.${format}`;
      }
    });

    let lowsrc = metadata.jpeg[0];

    try {
      return `<picture loading="lazy">
        ${Object.values(metadata).map(imageFormat => {
          return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
        }).join("\n")}
          <img
            src="${lowsrc.url}"
            width="${lowsrc.width}"
            height="${lowsrc.height}"
            alt="${alt}">
        </picture>`;
      } catch (err) {
        console.log(err)
      }
}