const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // 替换为你的MySQL用户名
    password: 'password123', // 替换为你的MySQL密码
    database: 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 将pool转换为Promise接口以便使用async/await
const promisePool = pool.promise();

module.exports = promisePool;