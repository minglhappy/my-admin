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
            // { path: '/proTable', name: 'proTable', component: 'proTable/index', meta: { title: 'ProTable演示', icon: 'Grid' } },
            {
              path: '/proTable',
              name: 'proTable',
              redirect: '/proTable/virtual',
              meta: { title: 'ProTable演示', icon: 'Grid' },
              children: [
                { path: '/proTable/virtual', name: 'virtualTable', component: 'proTable/virtualTable', meta: { title: '虚拟滚动演示', icon: 'DataLine', isKeepAlive: true } },
                { path: '/proTable/formLinkage', name: 'formLinkage', component: 'proTable/formLinkage', meta: { title: '表格联动演示', icon: 'Connection' } },
              ],
            },
            { path: '/directives', name: 'directives', component: 'directives/index', meta: { title: '指令演示', icon: 'MagicStick' } },
            { path: '/system/user', name: 'systemUser', component: 'system/user/index', meta: { title: '用户管理', icon: 'User' } },
            // { path: '/proTable/virtual', name: 'virtualTable', component: 'proTable/virtualTable', meta: { title: '虚拟滚动演示', icon: 'DataLine' } },
            // { path: '/proTable/formLinkage', name: 'formLinkage', component: 'proTable/formLinkage', meta: { title: '表单联动演示', icon: 'Connection' } },
            { path: '/upload', name: 'upload', component: 'upload/index', meta: { title: '分片上传演示', icon: 'Upload' } },
          ],
          msg: 'success',
        })
      );
    },
  },
];

export default mocks;
