// 电视剧剧集的逻辑
let ju_ji = function (item) {
  return {
    id: item.id,
    title: item.title,
    source: item.source,
  };
};

let ju = "";
$($(".vodplayinfo ul").get(0))
  .children()
  .each((index, item) => {
    let source = $(item).find("a").attr("href");
    ju = source;
  });

console.log("######剧集输出#######");
console.log(ju);
console.log("######剧集结束#######");
