const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const defaults = require('./defaults');

async function runSchema() {
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
}

async function ensureDefaultAdmin() {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'demo123';

    const existing = await pool.query('SELECT id FROM admin_users WHERE email = $1 LIMIT 1', [email]);
    if (existing.rows.length > 0) {
        return;
    }

    const hash = await bcrypt.hash(password, 12);

    await pool.query(
        'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)',
        [email, hash]
    );
}

async function ensureProfile() {
    const existing = await pool.query('SELECT id FROM profile WHERE id = 1');
    if (existing.rows.length > 0) {
        return;
    }

    const p = defaults.profile;
    await pool.query(
        `INSERT INTO profile (
            id, full_name, title, bio, email, phone, location, experience, specialty, focus,
            profile_image, about_image, linkedin_url, github_url, twitter_url, facebook_url, whatsapp_number
        ) VALUES (
            1, $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16
        )`,
        [
            p.full_name, p.title, p.bio, p.email, p.phone, p.location, p.experience, p.specialty, p.focus,
            p.profile_image, p.about_image, p.linkedin_url, p.github_url, p.twitter_url, p.facebook_url, p.whatsapp_number
        ]
    );
}

async function ensureServices() {
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM services');
    if (existing.rows[0].count > 0) {
        return;
    }

    for (const service of defaults.services) {
        await pool.query(
            'INSERT INTO services (title, description, icon, features) VALUES ($1, $2, $3, $4)',
            [service.title, service.description, service.icon, service.features]
        );
    }
}

async function ensureProjects() {
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM projects');
    if (existing.rows[0].count > 0) {
        return;
    }

    for (const project of defaults.projects) {
        await pool.query(
            'INSERT INTO projects (title, description, image, category, tech, link, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [project.title, project.description, project.image, project.category, project.tech, project.link, project.featured]
        );
    }
}

async function ensureBlog() {
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM blog_posts');
    if (existing.rows[0].count > 0) {
        return;
    }

    for (const post of defaults.blog) {
        await pool.query(
            `INSERT INTO blog_posts
            (title, content, excerpt, author, category, tags, image, date, read_time, link, featured)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                post.title, post.content, post.excerpt, post.author, post.category,
                post.tags, post.image, post.date, post.read_time, post.link, post.featured
            ]
        );
    }
}

async function ensureSkills() {
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM skills');
    if (existing.rows[0].count > 0) {
        return;
    }

    for (const skill of defaults.skills) {
        await pool.query(
            'INSERT INTO skills (name, level, category) VALUES ($1, $2, $3)',
            [skill.name, skill.level, skill.category]
        );
    }
}

async function ensureSettings() {
    const existing = await pool.query('SELECT id FROM app_settings WHERE id = 1');
    if (existing.rows.length > 0) {
        return;
    }

    const s = defaults.settings;
    await pool.query(
        'INSERT INTO app_settings (id, enable_comments, show_contact_form, enable_newsletter, email_notifications, visit_count) VALUES (1, $1, $2, $3, $4, $5)',
        [s.enable_comments, s.show_contact_form, s.enable_newsletter, s.email_notifications, 0]
    );
}

async function ensureDefaults() {
    await runSchema();
    await ensureDefaultAdmin();
    await ensureProfile();
    await ensureServices();
    await ensureProjects();
    await ensureBlog();
    await ensureSkills();
    await ensureSettings();
}

module.exports = {
    ensureDefaults
};
