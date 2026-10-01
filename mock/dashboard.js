// 对应 GET /geeker/dashboard/data
const mocks = [
  {
    pattern: '/geeker/dashboard/data',
    method: 'GET',
    handle: (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: {
            // 折线图：一周访问量趋势
            line: {
              days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
              values: [820, 932, 901, 934, 1290, 1330, 1320],
            },
            // 柱状图：分类销量
            bar: {
              categories: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'],
              values: [120, 200, 150, 80, 70],
            },
            // 饼图：流量来源
            pie: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' },
            ],
          },
          msg: 'ok',
        })
      );
    },
  },
];

export default mocks;
