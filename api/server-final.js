// server-final.js - 修复版本
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 数据库配置 - 修改为你的密码
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password123', // 你的MySQL密码
    database: 'charityevents_db'
};

const db = mysql.createPool(dbConfig).promise();

// ===== 所有API端点 =====

// 1. 根端点 - 显示所有可用端点
app.get('/', (req, res) => {
    console.log('📞 GET /');
    res.json({
        message: 'Charity Events API Server',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/test',
            '/api/db-test', 
            '/api/tables',
            '/api/events-simple',
            '/api/categories',
            '/api/events'
        ]
    });
});

// 2. 基础测试
app.get('/api/test', (req, res) => {
    console.log('📞 GET /api/test');
    res.json({
        status: 'success',
        message: 'API test endpoint is working!',
        testData: ['item1', 'item2', 'item3'],
        timestamp: new Date().toISOString()
    });
});

// 3. 数据库连接测试
app.get('/api/db-test', async (req, res) => {
    console.log('📞 GET /api/db-test');
    try {
        const [result] = await db.execute('SELECT 1 + 1 AS solution');
        res.json({
            status: 'success',
            message: 'Database connection successful!',
            database: 'charityevents_db',
            testResult: result[0].solution,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Database error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// 4. 表结构检查
app.get('/api/tables', async (req, res) => {
    console.log('📞 GET /api/tables');
    try {
        const [tables] = await db.execute('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);
        
        res.json({
            status: 'success',
            tables: tableNames,
            count: tableNames.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Tables error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get tables',
            error: error.message
        });
    }
});

// 5. 简单事件查询

app.get('/api/events-simple', async (req, res) => {
    console.log('📞 GET /api/events-simple');
    try {
        // 使用正确的列名 event_id 而不是 id
        const [rows] = await db.execute('SELECT event_id, event_name, event_date FROM events LIMIT 5');
        
        res.json({
            status: 'success',
            count: rows.length,
            events: rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Events simple error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch events',
            error: error.message
        });
    }
});

// 6. 获取类别
app.get('/api/categories', async (req, res) => {
    console.log('📞 GET /api/categories');
    try {
        const [rows] = await db.execute('SELECT * FROM categories');
        
        res.json({
            status: 'success',
            count: rows.length,
            categories: rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Categories error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});
// 活动详情API - 添加到 server-final.js
app.get('/api/events/:id', async (req, res) => {
    console.log('📞 GET /api/events/' + req.params.id);
    try {
        const eventId = req.params.id;
        const [rows] = await db.execute(`
            SELECT e.*, c.category_name, o.org_name as charity_name, 
                   o.mission_statement, o.contact_email, o.phone, o.address
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.category_id 
            LEFT JOIN organizations o ON e.org_id = o.org_id 
            WHERE e.event_id = ?
        `, [eventId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }
        
        res.json({
            status: 'success',
            event: rows[0],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Event details error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch event details',
            error: error.message
        });
    }
});
// 搜索API - 添加到 server-final.js
app.get('/api/events/search', async (req, res) => {
    console.log('📞 GET /api/events/search', req.query);
    try {
        const { date, location, category } = req.query;
        
        let query = `
            SELECT e.*, c.category_name, o.org_name as charity_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.category_id 
            LEFT JOIN organizations o ON e.org_id = o.org_id 
            WHERE e.is_active = TRUE
        `;
        
        const params = [];
        
        if (date) {
            query += ' AND DATE(e.event_date) = ?';
            params.push(date);
        }
        
        if (location) {
            query += ' AND e.event_location LIKE ?';
            params.push(`%${location}%`);
        }
        
        if (category) {
            query += ' AND c.category_name = ?';
            params.push(category);
        }
        
        query += ' ORDER BY e.event_date ASC';
        
        console.log('Search query:', query);
        console.log('Search params:', params);
        
        const [rows] = await db.execute(query, params);
        
        res.json({
            status: 'success',
            count: rows.length,
            events: rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Search error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Search failed',
            error: error.message
        });
    }
});
// 7. 主events API
app.get('/api/events', async (req, res) => {
    console.log('📞 GET /api/events');
    try {
        const [rows] = await db.execute(`
            SELECT e.*, c.category_name, o.org_name as charity_name 
            FROM events e 
            LEFT JOIN categories c ON e.category_id = c.category_id 
            LEFT JOIN organizations o ON e.org_id = o.org_id 
            WHERE e.is_active = TRUE 
            ORDER BY e.event_date ASC
        `);
        
        res.json({
            status: 'success',
            count: rows.length,
            events: rows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Events API error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch events',
            error: error.message,
            sqlMessage: error.sqlMessage
        });
    }
});

// ===== 错误处理 =====

// 404处理 - 必须放在所有路由之后，不要使用 '*'
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        requested: `${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            'GET /',
            'GET /api/test',
            'GET /api/db-test',
            'GET /api/tables', 
            'GET /api/events-simple',
            'GET /api/categories',
            'GET /api/events'
        ]
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('💥 Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: err.message
    });
});

// ===== 启动服务器 =====
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🎉 CHARITY EVENTS API SERVER STARTED');
    console.log('='.repeat(60));
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log('📚 Available Endpoints:');
    console.log('   👉 GET  /                 - Server info');
    console.log('   👉 GET  /api/test         - Basic API test');
    console.log('   👉 GET  /api/db-test      - Database connection test');
    console.log('   👉 GET  /api/tables       - List all tables');
    console.log('   👉 GET  /api/events-simple - Simple events query');
    console.log('   👉 GET  /api/categories   - Get all categories');
    console.log('   👉 GET  /api/events       - Get all events');
    console.log('='.repeat(60));
    console.log('⏰ Server started at:', new Date().toISOString());
    console.log('='.repeat(60));
});