// 对应 POST /geeker/login
const mocks = [
  {
    pattern: '/geeker/login',
    method: 'POST',
    handle: (req, res) => {
      const { username } = req.body || {};
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 200,
          data: { access_token: `token-${username}-${Date.now()}` },
          msg: 'success',
        })
      );
    },
  },
];

export default mocks;
