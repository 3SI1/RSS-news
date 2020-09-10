const newsItem = (title, description, link) => `
  <div class="news-item">
    <a href="${link}">
      <h3>${title}</h3>
      <p>${description}</p>
    </a>
  </div>
`;

const loadNews = (rootEl, url_news = []) =>
  Promise.all(
    url_news.map((url) => {
      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          let parser = new DOMParser();
          let xml = parser.parseFromString(data, "application/xml");
          return xml;
        })
        .then((xml) => {
          let newsEL = ``;
          let items = document.evaluate("/rss/channel/item", xml, null, XPathResult.ANY_TYPE, null);
          var item = items.iterateNext();
          while (item) {
            title = item.querySelector("title").textContent;
            link = item.querySelector("link").textContent;
            description = item.querySelector("description").textContent
            newsEL += newsItem(title, description, link);
            item = items.iterateNext();
          }
          return newsEL;
        })
        .then(allNews => rootEl.innerHTML += allNews)
      }
    )
  );

const NEWS_URL = [
  "https://www.cnnindonesia.com/nasional/rss",
  "https://www.vice.com/id_id/rss",
  "https://rss.detik.com/index.php/detikcom_nasional",
  "https://www.antaranews.com/rss/top-news"
];

loadNews(document.getElementById("root"), NEWS_URL)

