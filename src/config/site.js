export default {
  name: 'v_movie',
  menus: [
    { name: 'movie', path: '/movie', label: '电影', component: 'MovieView' },
    { name: 'tv', path: '/tv', label: '电视剧', component: 'TvView' },
    { name: 'reward', path: '/reward', label: '赞赏', component: 'RewardView' }
  ],
  dataSources: {
    movie: '/data/movies.json',
    tv: '/data/tv.json'
  }
}
