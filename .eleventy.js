module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addCollection("searchPages", function (collectionApi) {
    return collectionApi.getFilteredByGlob(["index.njk", "content/**/*.md"]);
  });

  eleventyConfig.addCollection("pages", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/*.md");
  });
};
