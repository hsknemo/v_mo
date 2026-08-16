let data_struct = function (item) {
  console.log(item);
  return {
    // 排序id
    id: 1,
    // 剧名
    title: item.title,
    // 剧别名
    originalTitle: item.alias,
    // 上映年份
    year: item.year,
    // 剧评分
    rating: item.rating,
    // 剧类型
    genre: item.genre,
    // 总共多少集数
    episodes: "更新至",
    // 导演
    director: item.director,
    // 主演
    cast: item.cast,
    // 剧介绍
    summary: item.summary,
    // 剧图片
    poster: item.poster,
    // 分集
    source: "",
  };
};

let vodBox = $(".vodBox");
let poster = $(vodBox).find(".vodImg .lazy").attr("src");
let title = $(vodBox).find(".vodInfo .vodh > h2 strong").text();
let rate = $(vodBox).find(".vodInfo .vodh strong > label").text();
let alias = $($(vodBox).find(".vodinfobox li").get(0))
  .find("strong span")
  .text();
let director = $($(vodBox).find(".vodinfobox li").get(1))
  .find("strong span")
  .text();
let cast = $($(vodBox).find(".vodinfobox li").get(2))
  .find("strong span")
  .text();
let genre = $($(vodBox).find(".vodinfobox li").get(3))
  .find("strong span")
  .text();
let area = $($(vodBox).find(".vodinfobox li").get(4))
  .find("strong span")
  .text();
let year = $($(vodBox).find(".vodinfobox li").get(6))
  .find("strong span")
  .text();
let summary = $(".vodplayinfo > strong").text();

let item = new data_struct({
  id: 2,
  title,
  year,
  rating: rate,
  genre: genre.split(","),
  director,
  cast: cast.split(","),
  poster,
  summary,
  originalTitle: alias,
});

console.log(JSON.stringify(item));
