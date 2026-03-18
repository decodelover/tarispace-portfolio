require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const pool = require('./db');
const { ensureDefaults } = require('./bootstrap');
const { createToken, authRequired } = require('./middleware/auth');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((value) => value.trim()).filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

function isLocalDevOrigin(origin) {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin || '');
}

app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Keep localhost convenience in development only.
        if (!isProduction && isLocalDevOrigin(origin)) {
            return callback(null, true);
        }

        if (!isProduction && allowedOrigins.length === 0) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    }
}));
app.use(express.json({ limit: '2mb' }));

function toArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
    return [];
}

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        return res.json({ status: 'ok' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const userResult = await pool.query(
        'SELECT id, email, password_hash FROM admin_users WHERE email = $1 LIMIT 1',
        [email]
    );

    const user = userResult.rows[0];
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken({ userId: user.id, email: user.email });

    return res.json({
        token,
        user: {
            id: user.id,
            email: user.email
        }
    });
});

app.post('/api/auth/change-password', authRequired, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || String(newPassword).length < 6) {
        return res.status(400).json({ message: 'Current password and a new password (min 6 chars) are required' });
    }

    const userResult = await pool.query(
        'SELECT id, password_hash FROM admin_users WHERE id = $1 LIMIT 1',
        [req.user.userId]
    );

    const user = userResult.rows[0];
    if (!user) {
        return res.status(404).json({ message: 'Admin user not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await pool.query(
        'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newHash, user.id]
    );

    return res.json({ message: 'Password updated successfully' });
});

app.post('/api/auth/reset-password', async (req, res) => {
    const { email, recoveryKey, newPassword } = req.body;

    if (!email || !recoveryKey || !newPassword || String(newPassword).length < 6) {
        return res.status(400).json({ message: 'Email, recovery key, and new password (min 6 chars) are required' });
    }

    if (!process.env.ADMIN_RECOVERY_KEY) {
        return res.status(400).json({ message: 'Password reset is disabled on this server' });
    }

    if (recoveryKey !== process.env.ADMIN_RECOVERY_KEY) {
        return res.status(403).json({ message: 'Recovery key is incorrect' });
    }

    const userResult = await pool.query(
        'SELECT id, email FROM admin_users WHERE email = $1 LIMIT 1',
        [email]
    );

    const user = userResult.rows[0];
    if (!user) {
        return res.status(404).json({ message: 'Admin account not found for that email' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query(
        'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newHash, user.id]
    );

    return res.json({ message: 'Password reset successfully' });
});

app.get('/api/public/site-data', async (req, res) => {
    const [profile, services, projects, blog, skills, settings] = await Promise.all([
        pool.query('SELECT * FROM profile WHERE id = 1 LIMIT 1'),
        pool.query('SELECT * FROM services ORDER BY id ASC'),
        pool.query('SELECT * FROM projects ORDER BY id ASC'),
        pool.query('SELECT * FROM blog_posts ORDER BY date DESC NULLS LAST, id DESC'),
        pool.query('SELECT * FROM skills ORDER BY id ASC'),
        pool.query('SELECT * FROM app_settings WHERE id = 1 LIMIT 1')
    ]);

    return res.json({
        profile: profile.rows[0] || null,
        services: services.rows,
        projects: projects.rows,
        blog: blog.rows,
        skills: skills.rows,
        settings: settings.rows[0] || null
    });
});

app.post('/api/public/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const result = await pool.query(
        'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, subject || '', message]
    );

    return res.status(201).json(result.rows[0]);
});

app.post('/api/public/track-visit', async (req, res) => {
    const result = await pool.query(
        'UPDATE app_settings SET visit_count = visit_count + 1, updated_at = NOW() WHERE id = 1 RETURNING visit_count'
    );

    return res.json({ visits: result.rows[0]?.visit_count || 0 });
});

app.use('/api', authRequired);

app.get('/api/profile', async (req, res) => {
    const result = await pool.query('SELECT * FROM profile WHERE id = 1 LIMIT 1');
    return res.json(result.rows[0] || null);
});

app.put('/api/profile', async (req, res) => {
    const profile = req.body;
    const result = await pool.query(
        `UPDATE profile
         SET full_name = $1, title = $2, bio = $3, email = $4, phone = $5, location = $6,
             experience = $7, specialty = $8, focus = $9, profile_image = $10, about_image = $11,
             linkedin_url = $12, github_url = $13, twitter_url = $14, facebook_url = $15, whatsapp_number = $16,
             updated_at = NOW()
         WHERE id = 1
         RETURNING *`,
        [
            profile.full_name || '', profile.title || '', profile.bio || '', profile.email || '', profile.phone || '',
            profile.location || '', Number(profile.experience || 0), profile.specialty || '', profile.focus || '',
            profile.profile_image || '', profile.about_image || '', profile.linkedin_url || '', profile.github_url || '',
            profile.twitter_url || '', profile.facebook_url || '', profile.whatsapp_number || ''
        ]
    );

    return res.json(result.rows[0]);
});

app.get('/api/services', async (req, res) => {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
    return res.json(result.rows);
});

app.post('/api/services', async (req, res) => {
    const { title, description, icon, features } = req.body;
    const result = await pool.query(
        'INSERT INTO services (title, description, icon, features) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description || '', icon || '', toArray(features)]
    );
    return res.status(201).json(result.rows[0]);
});

app.put('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, icon, features } = req.body;
    const result = await pool.query(
        'UPDATE services SET title = $1, description = $2, icon = $3, features = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [title, description || '', icon || '', toArray(features), id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Service not found' });
    }

    return res.json(result.rows[0]);
});

app.delete('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Service not found' });
    }
    return res.status(204).send();
});

app.get('/api/projects', async (req, res) => {
    const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    return res.json(result.rows);
});

app.post('/api/projects', async (req, res) => {
    const { title, description, image, category, tech, link, featured } = req.body;
    const result = await pool.query(
        'INSERT INTO projects (title, description, image, category, tech, link, featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, description || '', image || '', category || '', tech || '', link || '', Boolean(featured)]
    );
    return res.status(201).json(result.rows[0]);
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, image, category, tech, link, featured } = req.body;
    const result = await pool.query(
        `UPDATE projects
         SET title = $1, description = $2, image = $3, category = $4, tech = $5, link = $6, featured = $7, updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [title, description || '', image || '', category || '', tech || '', link || '', Boolean(featured), id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(result.rows[0]);
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
    }
    return res.status(204).send();
});

app.get('/api/blog', async (req, res) => {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC NULLS LAST, id DESC');
    return res.json(result.rows);
});

app.post('/api/blog', async (req, res) => {
    const { title, content, excerpt, author, category, tags, image, date, read_time, link, featured } = req.body;
    const result = await pool.query(
        `INSERT INTO blog_posts
         (title, content, excerpt, author, category, tags, image, date, read_time, link, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
            title, content || '', excerpt || '', author || '', category || '',
            toArray(tags), image || '', date || null, read_time || '', link || '', Boolean(featured)
        ]
    );
    return res.status(201).json(result.rows[0]);
});

app.put('/api/blog/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, excerpt, author, category, tags, image, date, read_time, link, featured } = req.body;
    const result = await pool.query(
        `UPDATE blog_posts
         SET title = $1, content = $2, excerpt = $3, author = $4, category = $5, tags = $6, image = $7,
             date = $8, read_time = $9, link = $10, featured = $11, updated_at = NOW()
         WHERE id = $12
         RETURNING *`,
        [
            title, content || '', excerpt || '', author || '', category || '', toArray(tags),
            image || '', date || null, read_time || '', link || '', Boolean(featured), id
        ]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Blog post not found' });
    }

    return res.json(result.rows[0]);
});

app.delete('/api/blog/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Blog post not found' });
    }
    return res.status(204).send();
});

app.get('/api/messages', async (req, res) => {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    return res.json(result.rows);
});

app.patch('/api/messages/:id/read', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        'UPDATE messages SET is_read = TRUE WHERE id = $1 RETURNING *',
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Message not found' });
    }

    return res.json(result.rows[0]);
});

app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(204).send();
});

app.get('/api/skills', async (req, res) => {
    const result = await pool.query('SELECT * FROM skills ORDER BY id ASC');
    return res.json(result.rows);
});

app.post('/api/skills', async (req, res) => {
    const { name, level, category } = req.body;
    const result = await pool.query(
        'INSERT INTO skills (name, level, category) VALUES ($1, $2, $3) RETURNING *',
        [name, Number(level || 0), category || '']
    );
    return res.status(201).json(result.rows[0]);
});

app.put('/api/skills/:id', async (req, res) => {
    const { id } = req.params;
    const { name, level, category } = req.body;
    const result = await pool.query(
        'UPDATE skills SET name = $1, level = $2, category = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [name, Number(level || 0), category || '', id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Skill not found' });
    }

    return res.json(result.rows[0]);
});

app.delete('/api/skills/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Skill not found' });
    }
    return res.status(204).send();
});

app.get('/api/settings', async (req, res) => {
    const result = await pool.query('SELECT * FROM app_settings WHERE id = 1 LIMIT 1');
    return res.json(result.rows[0] || null);
});

app.put('/api/settings', async (req, res) => {
    const { enable_comments, show_contact_form, enable_newsletter, email_notifications, visit_count } = req.body;

    const currentSettings = await pool.query('SELECT * FROM app_settings WHERE id = 1 LIMIT 1');
    const current = currentSettings.rows[0];

    const result = await pool.query(
        `UPDATE app_settings
         SET enable_comments = $1, show_contact_form = $2, enable_newsletter = $3, email_notifications = $4,
             visit_count = $5, updated_at = NOW()
         WHERE id = 1
         RETURNING *`,
        [
            enable_comments === undefined ? current.enable_comments : Boolean(enable_comments),
            show_contact_form === undefined ? current.show_contact_form : Boolean(show_contact_form),
            enable_newsletter === undefined ? current.enable_newsletter : Boolean(enable_newsletter),
            email_notifications === undefined ? current.email_notifications : Boolean(email_notifications),
            visit_count === undefined ? current.visit_count : Number(visit_count || 0)
        ]
    );

    return res.json(result.rows[0]);
});

app.get('/api/stats', async (req, res) => {
    const [messages, projects, blog, services, skills, settings] = await Promise.all([
        pool.query('SELECT COUNT(*)::int AS count FROM messages'),
        pool.query('SELECT COUNT(*)::int AS count FROM projects'),
        pool.query('SELECT COUNT(*)::int AS count FROM blog_posts'),
        pool.query('SELECT COUNT(*)::int AS count FROM services'),
        pool.query('SELECT COUNT(*)::int AS count FROM skills'),
        pool.query('SELECT visit_count FROM app_settings WHERE id = 1 LIMIT 1')
    ]);

    return res.json({
        visits: settings.rows[0]?.visit_count || 0,
        messages: messages.rows[0].count,
        projects: projects.rows[0].count,
        blog: blog.rows[0].count,
        services: services.rows[0].count,
        skills: skills.rows[0].count
    });
});

app.use((err, req, res, next) => {
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
});

const port = Number(process.env.PORT || 4000);

async function start() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set. Add it to backend/.env');
    }

    await ensureDefaults();

    app.listen(port, () => {
        console.log(`Tarispace backend running on http://localhost:${port}`);
    });
}

start().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
