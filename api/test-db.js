const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 替换为你的MySQL用户名
    password: 'password123', // 替换为你的MySQL密码
    database: 'charityevents_db'
});

console.log('🔍 Testing database connection...');

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    
    console.log('✅ Connected to MySQL database');
    
    // 测试简单查询
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('❌ Simple query failed:', err.message);
        } else {
            console.log('✅ Simple query result:', results[0].solution);
        }
        
        // 测试events表
        connection.query('SHOW TABLES', (err, results) => {
            if (err) {
                console.error('❌ Show tables failed:', err.message);
            } else {
                console.log('✅ Available tables:', results.map(row => Object.values(row)[0]));
            }
            
            connection.end();
        });
    });
});