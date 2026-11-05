(() => {
  const form = document.querySelector("#page-search");
  const input = document.querySelector("#search-query");
  const status = document.querySelector("#search-status");
  const results = document.querySelector("#search-results");
  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase();
  let indexPromise;
  let request = 0;

  async function search() {
    const current = ++request;
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    results.replaceChildren();
    results.hidden = true;
    if (!terms.length) {
      status.textContent = "";
      return;
    }
    status.textContent = "Searching…";
    try {
      if (!indexPromise) {
        indexPromise = fetch("/search-index.json")
          .then((response) => {
            if (!response.ok) throw new Error("Search index unavailable");
            return response.json();
          })
          .then((pages) => pages.map((page) => {
            const decoder = document.createElement("textarea");
            decoder.innerHTML = page.content;
            return { ...page, content: decoder.value };
          }))
          .catch((error) => {
            indexPromise = undefined;
            throw error;
          });
      }
      const pages = await indexPromise;
      if (current !== request) return;
      const matches = pages.filter((page) => {
        const text = normalize(`${page.title} ${page.content}`);
        return terms.every((term) => text.includes(term));
      });
      status.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? "page" : "pages"} found.`
        : "No matching pages found.";
      for (const page of matches) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = page.url;
        link.textContent = page.title;
        const excerpt = document.createElement("p");
        excerpt.textContent = page.content.slice(0, 160) + (page.content.length > 160 ? "…" : "");
        item.append(link, excerpt);
        results.append(item);
      }
      results.hidden = !matches.length;
    } catch {
      if (current !== request) return;
      status.textContent = "Could not load search data. Please try again.";
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });
  input.addEventListener("input", search);
})();
