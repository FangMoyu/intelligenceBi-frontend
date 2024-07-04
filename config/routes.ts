export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {path: "/", redirect: "add_chart"},
  {name: "智能分析", path: "/add_chart" , icon: "BarChartOutlined", component: "./AddChart"},
  {name: "智能分析(异步)", path: "/add_chart_async" , icon: "BarChartOutlined", component: "./AddChartAsync"},
  {name: "智能分析(消息队列异步)", path: "/add_chart_async_byMQ" , icon: "BarChartOutlined", component: "./AddChartAsyncByMQ"},
  {name: "我的图表", path: "/my_chart" , icon: "AreaChartOutlined", component: "./MyChart"},

  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
