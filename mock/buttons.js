// 对应 GET /geeker/auth/buttons
const mocks = [
  {
    pattern: '/geeker/auth/buttons',
    method: 'GET',
    handle: (req, res) => {
      // 真实后端：根据登录用户角色查询权限码列表
      // 教学版：模拟当前角色有"新增/删除/导出"，没有"编辑"
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: ['user:add', 'user:delete', 'user:export', 'user:edit'],
          msg: 'ok',
        })
      );
    },
  },
];

export default mocks;
