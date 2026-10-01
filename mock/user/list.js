// 对应 POST /geeker/user/list
const users = [
  { id: 1, username: 'admin1', nickname: '管理员', status: 1, createTime: '2026-08-01 10:00:00' },
  { id: 2, username: 'zhangsan1', nickname: '张三', status: 1, createTime: '2026-08-02 11:30:00' },
  { id: 3, username: 'lisi1', nickname: '李四', status: 0, createTime: '2026-08-03 14:20:00' },
  { id: 4, username: 'wangwu', nickname: '王五', status: 1, createTime: '2026-08-04 09:15:00' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', status: 0, createTime: '2026-08-05 16:40:00' },
];

const mocks = [
  {
    pattern: '/geeker/user/list',
    method: 'POST',
    handle: (req, res) => {
      const { pageNum = 1, pageSize = 10, username, status } = req.body || {};

      let list = users.filter((item) => {
        if (username && !item.username.includes(username)) return false;
        if (status !== '' && status !== undefined && status !== null && item.status !== Number(status)) return;
        false;
        return true;
      });

      const start = (pageNum - 1) * pageSize;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: { list: list.slice(start, start + pageSize), total: list.length },
          msg: 'success',
        })
      );
    },
  },
];

export default mocks;
