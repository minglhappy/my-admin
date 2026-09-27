// 分片上传相关的两个 Mock 接口

const uploadedChunks = new Map(); // filename → Set<已收到的片序号>

const mocks = [
  {
    pattern: '/geeker/upload/chunk',
    method: 'POST',
    handle: (req, res) => {
      // 真实后端：把片存到临时目录（按 index 命名）
      // Mock：直接返回成功
      // 片序号/文件名走 query（multipart body 的字段 mock 不解析，真实后端两者皆可）
      const { index, filename } = req.query;
      if (!uploadedChunks.has(filename)) {
        uploadedChunks.set(filename, new Set());
      }
      uploadedChunks.get(filename).add(Number(index)); // ★ 记录"这片已收到"
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ code: 200, data: null, msg: `chunk ${index} ok` }));
    },
  },

  {
    // 断点续传核心接口：查询已传分片
    pattern: '/geeker/upload/check',
    method: 'GET',
    handle: (req, res) => {
      const { filename } = req.query;
      const chunks = uploadedChunks.get(filename) || new Set();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ code: 200, data: [...chunks], msg: 'ok' }));
    },
  },

  {
    pattern: '/geeker/upload/merge',
    method: 'POST',
    handle: (req, res) => {
      // 真实后端：按 index 排序所有片，依次追加拼成完整文件
      // Mock：返回假地址
      const { filename } = req.body || {};
      uploadedChunks.delete(filename); // ★ 合并完成 → 清理记录（这个文件的上传任务结束）
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: { url: `/files/${filename}` },
          msg: 'merge ok',
        })
      );
    },
  },
];

export default mocks;
