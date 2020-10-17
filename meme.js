const { subreddit, pages } = require("./config.json");
const rp = require("request-promise");
const $ = require("cheerio");
const memeUrl = `https://old.reddit.com/r/${subreddit}`;

let memeDataUrlList = [];
let lastFetchedTime = null;

async function updateMemes() {
  let memeUrlList = [];
  let nextUrl = memeUrl;
  for (i = 0; i < pages; i++) {
    let memelist1 = await rp(nextUrl)
      .then((html) => {
        let links = $(".thing:not(.promoted):not(.stickied)", html).map(
          (i, e) => {
            if (e.attribs["data-domain"] === "i.redd.it")
              return e.attribs["data-url"];
          }
        );
        nextUrl = $("span.next-button a", html).attr("href");
        lastFetchedTime = new Date();
        return links.get();
      })
      .catch(console.error);
    memeUrlList.push(...memelist1);
  }
  memeDataUrlList = memeUrlList;
}

function giveMemeLink() {
  if (new Date() - lastFetchedTime > 1800000) updateMemes();
  let index = Math.floor(Math.random() * memeDataUrlList.length);
  return memeDataUrlList[index];
}

module.exports.giveMemeLink = giveMemeLink;
