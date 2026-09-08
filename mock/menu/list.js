// 对应 GET /geeker/menu/list
const mocks = [
  {
    pattern: '/geeker/menu/list',
    method: 'GET',
    handle: (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: [
            { path: '/home/index', name: 'home', component: 'home/index', meta: { title: '首页', icon: 'HomeFilled' } },
            { path: '/proTable', name: 'proTable', component: 'proTable/index', meta: { title: 'ProTable演示', icon: 'Grid' } },
            { path: '/directives', name: 'directives', component: 'directives/index', meta: { title: '指令演示', icon: 'MagicStick' } },
            { path: '/system/user', name: 'systemUser', component: 'system/user/index', meta: { title: '用户管理', icon: 'User' } },
          ],
          msg: 'success',
        })
      );
    },
  },
];

export default mocks;
