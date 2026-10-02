// 对应 GET /geeker/dashboard/data
const mocks = [
  {
    pattern: '/geeker/dashboard/data',
    method: 'GET',
    handle: (req, res) => {
      const random = (base, range) => Math.floor(Math.random() * range) + base;

      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: {
            // 折线图：一周访问量趋势
            line: {
              days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
              values: Array.from({ length: 7 }, () => random(800, 600)),
            },
            // 柱状图：分类销量
            bar: {
              categories: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'],
              values: Array.from({ length: 5 }, () => random(60, 150)),
            },
            // 饼图：流量来源
            pie: [
              { value: random(800, 400), name: '搜索引擎' },
              { value: random(500, 300), name: '直接访问' },
              { value: random(400, 200), name: '邮件营销' },
              { value: random(300, 200), name: '联盟广告' },
              { value: random(200, 150), name: '视频广告' },
            ],
            updatedAt: new Date().toLocaleTimeString(),
          },
          msg: 'ok',
        })
      );
    },
  },
];

export default mocks;
