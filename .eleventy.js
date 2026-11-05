module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addCollection("pages", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/guide.md");
  });
};