const express = require('express');
const cors = require('cors');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 1. 首页API - 获取所有活跃和即将举办的活动
app.get('/api/events', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, c.name as category_name, ch.name as charity_name 
            FROM events e 
            LEFT JOIN event_categories c ON e.category_id = c.id 
            LEFT JOIN charities ch ON e.charity_id = ch.id 
            WHERE e.is_active = TRUE AND e.event_date >= NOW() 
            ORDER BY e.event_date ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. 搜索API - 根据条件筛选活动
app.get('/api/events/search', async (req, res) => {
    try {
        const { date, location, category } = req.query;
        
        let query = `
            SELECT e.*, c.name as category_name, ch.name as charity_name 
            FROM events e 
            LEFT JOIN event_categories c ON e.category_id = c.id 
            LEFT JOIN charities ch ON e.charity_id = ch.id 
            WHERE e.is_active = TRUE AND e.event_date >= NOW()
        `;
        
        const params = [];
        
        // 动态构建查询条件
        if (date) {
            query += ' AND DATE(e.event_date) = ?';
            params.push(date);
        }
        
        if (location) {
            query += ' AND e.location LIKE ?';
            params.push(`%${location}%`);
        }
        
        if (category) {
            query += ' AND c.name = ?';
            params.push(category);
        }
        
        query += ' ORDER BY e.event_date ASC';
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. 获取活动类别API
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM event_categories');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. 活动详情API
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const [rows] = await db.execute(`
            SELECT e.*, c.name as category_name, ch.name as charity_name, 
                   ch.mission_statement, ch.contact_email, ch.phone, ch.address
            FROM events e 
            LEFT JOIN event_categories c ON e.category_id = c.id 
            LEFT JOIN charities ch ON e.charity_id = ch.id 
            WHERE e.id = ?
        `, [eventId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});