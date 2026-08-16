export default {
  name: "v_movie",
  menus: [
    { name: "movie", path: "/movie", label: "电影", component: "MovieView" },
    { name: "tv", path: "/tv", label: "电视剧", component: "TvView" },
    {
      name: "variety",
      path: "/variety",
      label: "综艺",
      component: "VarietyView",
    },
    { name: "anime", path: "/anime", label: "动漫", component: "AnimeView" },
    { name: "food", path: "/food", label: "下饭", component: "FoodView" },
    { name: "reward", path: "/reward", label: "赞赏", component: "RewardView" },
  ],
  dataSources: {
    movie: "/data/movies.json",
    tv: "/data/tv.json",
    variety: "/data/variety.json",
    anime: "/data/anime.json",
    food: "/data/food.json",
  },
};
