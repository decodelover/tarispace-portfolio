require('dotenv').config();

const pool = require('../src/db');
const { ensureDefaults } = require('../src/bootstrap');

const PROD_API_BASE = process.env.PROD_API_BASE || 'https://www.tarispace.me/api';
const PROD_ADMIN_EMAIL = process.env.PROD_ADMIN_EMAIL || '';
const PROD_ADMIN_PASSWORD = process.env.PROD_ADMIN_PASSWORD || '';

function toArray(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
}

function normalizeProfile(profile = {}) {
    return {
        full_name: profile.full_name || profile.fullName || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        experience: Number(profile.experience || 0),
        specialty: profile.specialty || '',
        focus: profile.focus || '',
        profile_image: profile.profile_image || profile.profileImage || '',
        about_image: profile.about_image || profile.aboutImage || '',
        linkedin_url: profile.linkedin_url || profile.linkedinUrl || '',
        github_url: profile.github_url || profile.githubUrl || '',
        twitter_url: profile.twitter_url || profile.twitterUrl || '',
        facebook_url: profile.facebook_url || profile.facebookUrl || '',
        whatsapp_number: profile.whatsapp_number || profile.whatsappNumber || ''
    };
}

function normalizeSettings(settings = {}) {
    return {
        enable_comments: Boolean(settings.enable_comments ?? settings.enableComments),
        show_contact_form: Boolean(settings.show_contact_form ?? settings.showContactForm),
        enable_newsletter: Boolean(settings.enable_newsletter ?? settings.enableNewsletter),
        email_notifications: Boolean(settings.email_notifications ?? settings.emailNotifications),
        visit_count: Number(settings.visit_count || settings.visitCount || 0)
    };
}

async function fetchJson(path, options = {}) {
    const response = await fetch(`${PROD_API_BASE}${path}`, options);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed ${path}: ${response.status} ${body}`);
    }
    return response.json();
}

async function tryFetchMessages() {
    if (!PROD_ADMIN_EMAIL || !PROD_ADMIN_PASSWORD) {
        console.log('Skipping message sync (PROD_ADMIN_EMAIL/PROD_ADMIN_PASSWORD not set).');
        return null;
    }

    try {
        const login = await fetchJson('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: PROD_ADMIN_EMAIL,
                password: PROD_ADMIN_PASSWORD
            })
        });

        const messages = await fetchJson('/messages', {
            headers: {
                Authorization: `Bearer ${login.token}`
            }
        });

        return messages;
    } catch (error) {
        console.log(`Skipping message sync (${error.message}).`);
        return null;
    }
}

async function replaceData(siteData, messages = null) {
    const profile = normalizeProfile(siteData.profile || {});
    const services = Array.isArray(siteData.services) ? siteData.services : [];
    const projects = Array.isArray(siteData.projects) ? siteData.projects : [];
    const blog = Array.isArray(siteData.blog) ? siteData.blog : [];
    const skills = Array.isArray(siteData.skills) ? siteData.skills : [];
    const settings = normalizeSettings(siteData.settings || {});

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM profile');
        await client.query('DELETE FROM services');
        await client.query('DELETE FROM projects');
        await client.query('DELETE FROM blog_posts');
        await client.query('DELETE FROM skills');
        await client.query('DELETE FROM app_settings');

        await client.query(
            `INSERT INTO profile (
                id, full_name, title, bio, email, phone, location, experience, specialty, focus,
                profile_image, about_image, linkedin_url, github_url, twitter_url, facebook_url, whatsapp_number
            ) VALUES (
                1, $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14, $15, $16
            )`,
            [
                profile.full_name,
                profile.title,
                profile.bio,
                profile.email,
                profile.phone,
                profile.location,
                profile.experience,
                profile.specialty,
                profile.focus,
                profile.profile_image,
                profile.about_image,
                profile.linkedin_url,
                profile.github_url,
                profile.twitter_url,
                profile.facebook_url,
                profile.whatsapp_number
            ]
        );

        for (const service of services) {
            await client.query(
                'INSERT INTO services (title, description, icon, features, updated_at) VALUES ($1, $2, $3, $4, NOW())',
                [
                    service.title || '',
                    service.description || '',
                    service.icon || '',
                    toArray(service.features)
                ]
            );
        }

        for (const project of projects) {
            await client.query(
                `INSERT INTO projects
                (title, description, image, category, tech, link, featured, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [
                    project.title || '',
                    project.description || '',
                    project.image || '',
                    project.category || '',
                    project.tech || '',
                    project.link || '',
                    Boolean(project.featured)
                ]
            );
        }

        for (const post of blog) {
            await client.query(
                `INSERT INTO blog_posts
                (title, content, excerpt, author, category, tags, image, date, read_time, link, featured, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
                [
                    post.title || '',
                    post.content || '',
                    post.excerpt || '',
                    post.author || '',
                    post.category || '',
                    toArray(post.tags),
                    post.image || '',
                    post.date || null,
                    post.read_time || post.readTime || '',
                    post.link || '',
                    Boolean(post.featured)
                ]
            );
        }

        for (const skill of skills) {
            await client.query(
                'INSERT INTO skills (name, level, category, updated_at) VALUES ($1, $2, $3, NOW())',
                [
                    skill.name || '',
                    Number(skill.level || 0),
                    skill.category || ''
                ]
            );
        }

        await client.query(
            `INSERT INTO app_settings
            (id, enable_comments, show_contact_form, enable_newsletter, email_notifications, visit_count, updated_at)
            VALUES (1, $1, $2, $3, $4, $5, NOW())`,
            [
                settings.enable_comments,
                settings.show_contact_form,
                settings.enable_newsletter,
                settings.email_notifications,
                settings.visit_count
            ]
        );

        if (messages) {
            await client.query('DELETE FROM messages');

            for (const message of messages) {
                await client.query(
                    `INSERT INTO messages
                    (name, email, subject, message, is_read, created_at)
                    VALUES ($1, $2, $3, $4, $5, COALESCE($6::timestamptz, NOW()))`,
                    [
                        message.name || message.from || 'Anonymous',
                        message.email || '',
                        message.subject || '',
                        message.message || '',
                        Boolean(message.is_read || message.isRead || message.read),
                        message.created_at || message.time || null
                    ]
                );
            }
        }

        await client.query('COMMIT');

        console.log(`Synced profile=1 services=${services.length} projects=${projects.length} blog=${blog.length} skills=${skills.length}`);
        if (messages) {
            console.log(`Synced messages=${messages.length}`);
        }
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function main() {
    try {
        await ensureDefaults();

        console.log(`Fetching production data from ${PROD_API_BASE}`);
        const siteData = await fetchJson('/public/site-data');
        const messages = await tryFetchMessages();

        await replaceData(siteData, messages);

        console.log('Local database sync complete.');
    } catch (error) {
        console.error(`Sync failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
