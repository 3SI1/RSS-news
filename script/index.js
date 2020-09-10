// Author Jafar Husaini Aziz
// feel free to copy
// full project on https://github.com/jfrAziz/RSS-news

const $ = (el) => document.getElementById(el)

const newsItem = (title, description, link) => `
  <div class="news-item">
    <a href="${link}">
      <h3>${title}</h3>
      <p>${description}</p>
    </a>
  </div>
`;

const loadNewsFromXML = (rootEl, url_news = []) =>
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

const loadNewsFromJSON = (rootEl,url_news = []) => 
  Promise.all(
    url_news.map((url) => {
      fetch(url)
        .then((res) => res.text())
        .then((text) => xmlToJson(text))
        .then((json) => JSON.parse(json))
        .then((data) => {
          let newsEL = ``;
          let items = data.rss.channel.item
          items.map((item)=>{
            title = item.title["#cdata-section"]
            link = item.link
            description = item.description["#cdata-section"]
            
            newsEL += newsItem(title,description,link)
          })
          return newsEL
        })
        .then(allNews => rootEl.innerHTML += allNews)
      }
    )
  )

const NEWS_URL = [
  "https://rss.detik.com/index.php/detikcom_nasional",
  "https://www.cnnindonesia.com/nasional/rss",
  "https://www.vice.com/id_id/rss"
];


const toggleXMLorJSON = () => {
  $("json-btn").classList.toggle("active")
  $("json-info").classList.toggle("active")
  $("xml-btn").classList.toggle("active")
  $("xml-info").classList.toggle("active")
  $("root").innerHTML = ""
}

$("json-btn").addEventListener("click", ()=>{
  toggleXMLorJSON()
  loadNewsFromJSON($("root"), NEWS_URL)
})

$("xml-btn").addEventListener("click", ()=>{
  toggleXMLorJSON()
  loadNewsFromXML($("root"), NEWS_URL)
})

loadNewsFromXML($("root"), NEWS_URL)
