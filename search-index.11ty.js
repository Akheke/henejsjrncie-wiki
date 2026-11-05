module.exports = class {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
      eleventyImport: { collections: ["searchPages"] },
    };
  }

  render({ collections }) {
    return JSON.stringify(collections.searchPages.map((page) => ({
      title: page.data.title || page.fileSlug,
      url: page.url,
      content: String(page.templateContent)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ").trim(),
    })));
  }
};
