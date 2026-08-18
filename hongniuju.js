// 电视剧剧集的逻辑
let ju_ji = function(item) {
    return {
        id: item.id,
        title: item.title,
        source: item.source,
    };
};

let ju = [];
$($(".vodplayinfo ul").get(0))
    .children()
    .each((index, item) => {
        let source = $(item).find("a").attr("href");
        let name = $(item).find("a").attr("title");
        let id = index + 1;
        let n = new ju_ji({
            id,
            title: name,
            source,
        });
        ju.push(n);
    });

console.log("######剧集输出#######");
console.log(JSON.stringify(ju));
console.log("######剧集结束#######");

// a = ju

// var b = a.filter(item => item.title.startsWith('第') && item.title.endsWith('期') || item.title.endsWith('期\t'))

// console.log(JSON.stringify(b));

/**
 * c = b
 * c.forEach((item, index) => {
    item.id = index + 1
})
 */