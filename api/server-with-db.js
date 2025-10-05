const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 直接创建数据库连接（不使用单独的event_db.js）
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // 替换为你的MySQL密码
    database: 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// 测试数据库连接
app.get('/api/db-test', async (req, res) => {
    try {
        console.log('🔍 Testing database connection...');
        
        // 测试简单查询
        const [result] = await db.execute('SELECT 1 + 1 AS solution');
        console.log('✅ Database connection successful');
        
        res.json({ 
            status: 'success', 
            database: 'connected',
            testResult: result[0].solution
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        res.status(500).json({ 
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// 简单的events端点（不涉及复杂JOIN）
app.get('/api/events-simple', async (req, res) => {
    try {
        console.log('📡 /api/events-simple called');
        
        // 先只查询events表，不JOIN其他表
        const [rows] = await db.execute('SELECT * FROM events LIMIT 5');
        console.log(`✅ Found ${rows.length} events`);
        
        res.json(rows);
    } catch (error) {
        console.error('❌ Error in events-simple:', error.message);
        res.status(500).json({ 
            error: 'Database query failed',
            details: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

// 检查表结构
app.get('/api/tables', async (req, res) => {
    try {
        console.log('📊 Checking table structure...');
        
        const [tables] = await db.execute('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        
        console.log('📋 Tables found:', tableNames);
        
        // 获取每个表的结构
        const tableStructures = {};
        for (const tableName of tableNames) {
            const [columns] = await db.execute(`DESCRIBE ${tableName}`);
            tableStructures[tableName] = columns;
        }
        
        res.json({
            tables: tableNames,
            structures: tableStructures
        });
    } catch (error) {
        console.error('❌ Error checking tables:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Test URLs:`);
    console.log(`   http://localhost:${PORT}/api/db-test`);
    console.log(`   http://localhost:${PORT}/api/events-simple`);
    console.log(`   http://localhost:${PORT}/api/tables`);
});