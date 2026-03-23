require('dotenv').config();

const pool = require('../src/db');

const services = [
    {
        title: 'Frontend Development',
        description: 'Creating stunning, responsive user interfaces with React, Vue, and modern CSS. Focused on performance, accessibility, and beautiful design.',
        icon: 'la-code',
        features: ['React/Vue.js', 'Responsive Design', 'Performance']
    },
    {
        title: 'Backend Development',
        description: 'Building robust, scalable server-side solutions with Node.js, Express, and modern databases. APIs, authentication, and cloud integration.',
        icon: 'la-server',
        features: ['Node.js', 'APIs', 'Databases']
    },
    {
        title: 'Full Stack Solutions',
        description: 'End-to-end development of complete web applications from database design to UI implementation. Comprehensive solutions for your business needs.',
        icon: 'la-cube',
        features: ['Full Stack', 'End-to-End', 'Scalable']
    },
    {
        title: 'Web3 & Blockchain',
        description: 'Smart contract development, DApp creation, and blockchain integration. Specializing in Ethereum, Starknet, and Web3 architecture design.',
        icon: 'la-cube',
        features: ['Smart Contracts', 'DApps', 'Web3']
    },
    {
        title: 'Performance Optimization',
        description: 'Enhancing speed, SEO rankings, and user experience. Code optimization, image compression, caching strategies, and Core Web Vitals improvement.',
        icon: 'la-rocket',
        features: ['Optimization', 'SEO', 'Speed']
    },
    {
        title: 'Technical Consultation',
        description: 'Expert guidance on technology selection, architecture design, and implementation strategies. Helping you choose the right tools for your vision.',
        icon: 'la-comments',
        features: ['Architecture', 'Strategy', 'Planning']
    }
];

const projects = [
    {
        title: 'Starknet RD Project',
        description: 'A comprehensive blockchain infrastructure platform built on Starknet L2. Features smart contract deployment and developer tools for the Cairo ecosystem.',
        image: 'img/starknetrd.png',
        category: 'blockchain',
        tech: 'Blockchain, Cairo, Web3',
        link: 'https://starknetrd.com',
        featured: true
    },
    {
        title: 'Taricents E-Commerce',
        description: 'A modern e-commerce platform with seamless user experience. Includes product catalog, shopping cart, and secure checkout functionality.',
        image: 'img/tariscent.png',
        category: 'web',
        tech: 'React, Node.js, Responsive',
        link: 'https://taricentscom.vercel.app/',
        featured: true
    },
    {
        title: 'Asteria-lux',
        description: 'Asteria Luxury Store is a full-stack luxury e-commerce solution that enables premium brands to manage online sales, customer accounts, payments, and store operations through a modern storefront and a powerful admin dashboard.',
        image: 'img/asteria-lux.png',
        category: 'web',
        tech: 'React.js, Node.js, CSS, JavaScript, HTML, PostgreSQL, Express, JWT',
        link: 'https://asteria-lux.vercel.app/',
        featured: false
    },
    {
        title: 'DeltaDCA',
        description: 'DeltaDCA is a full-stack crypto dollar-cost averaging planner. It lets users run live DCA backtests against market data, review projected outcomes, create accounts, and save simulations to PostgreSQL.',
        image: 'img/deltadca.png',
        category: 'web',
        tech: 'React, Node.js, PostgreSQL, Vercel, CSS, HTML, JavaScript',
        link: 'https://deltadca.vercel.app/',
        featured: false
    },
    {
        title: 'Tarispace',
        description: 'Tarispace is a modern, responsive portfolio and personal-brand platform for a full-stack and blockchain developer, combining an immersive one-page experience, project and blog showcases, and an admin dashboard with real-time cloud sync for easy content management.',
        image: 'img/tarspace.png',
        category: 'web',
        tech: 'HTML, CSS, JavaScript, Node.js, PostgreSQL',
        link: 'https://www.tarispace.me/',
        featured: false
    },
    {
        title: 'Soltrace',
        description: 'Live Solana wallet tracker built with React, Vite, Node.js, Express, and Solana Web3. Soltrace lets you paste a public Solana wallet address and fetch its live SOL balance through a simple dashboard.',
        image: 'img/soltrace.png',
        category: 'blockchain',
        tech: 'React, Vite, Node.js, Express, @solana/web3.js, Vercel Functions',
        link: 'https://soltrace-tracker.vercel.app/',
        featured: false
    }
];

const blogPosts = [
    {
        title: 'Out of the Smoke: The Story Behind the Code',
        content: 'A powerful personal narrative about overcoming adversity, from street life to full-stack development. The journey that shaped Tarispace and the philosophy behind every project I build.',
        excerpt: 'From the streets to the code: The inspiring journey of how I went from roasting plantain for survival to becoming a full-stack developer.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Personal Story',
        tags: ['personal journey', 'full stack dev', 'inspiration', 'entrepreneurship', 'web development'],
        image: 'img/blog/1.jpg',
        date: '2025-01-25',
        read_time: '12 min read',
        link: 'article-out-of-smoke.html',
        featured: true
    },
    {
        title: 'The Dangers of Not Following Latest Trends',
        content: 'Why staying oblivious to technological evolution is sabotaging your career. The price of ignoring trends, the compounding effects of stagnation, and how to stay relevant in a fast-moving tech landscape.',
        excerpt: 'Ignoring tech trends is expensive. Here\'s why staying current isn\'t optional in today\'s market.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Career Insights',
        tags: ['tech trends', 'career growth', 'evolution', 'professional development'],
        image: 'img/blog/2.jpg',
        date: '2026-01-27',
        read_time: '8 min read',
        link: 'article-dangers-not-following-trends.html',
        featured: false
    },
    {
        title: 'The Importance of Having a Digital Skill',
        content: 'In a world moving digital, having at least one digital skill is no longer optional-it\'s survival. Discover the freedom, leverage, and opportunity that comes with mastering a digital skill.',
        excerpt: 'Digital skills are the new currency. Learn why this is non-negotiable in the modern economy.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Skills',
        tags: ['digital skills', 'education', 'opportunity', 'career', 'future'],
        image: 'img/blog/3.jpg',
        date: '2026-01-27',
        read_time: '9 min read',
        link: 'article-importance-digital-skills.html',
        featured: false
    },
    {
        title: 'Programming Problem-Solving Applies to Real Life',
        content: 'The skills you develop debugging code translate directly to solving problems in your everyday life. Learn how systematic thinking becomes your superpower.',
        excerpt: 'The debugging mindset is not just for code. It is the key to solving any problem systematically.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Mindset',
        tags: ['problem-solving', 'programming', 'mindset', 'growth', 'systems thinking'],
        image: 'img/blog/4.jpg',
        date: '2026-02-10',
        read_time: '10 min read',
        link: 'article-programming-solves-real-life.html',
        featured: false
    },
    {
        title: 'From Failure to Success: Why Your First Project Does Not Define Your Career',
        content: 'Your first project will likely fail. That is not the end-it is the beginning. Learn why failure is the best teacher and how it leads to extraordinary success.',
        excerpt: 'Everyone\'s first major project fails. What matters is what happens next. Here\'s how failure becomes your greatest advantage.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Resilience',
        tags: ['failure', 'resilience', 'success', 'mindset', 'growth'],
        image: 'img/blog/5.jpg',
        date: '2026-02-28',
        read_time: '9 min read',
        link: 'article-failure-to-success.html',
        featured: false
    },
    {
        title: 'Building Software, Building Character: What Code Teaches You',
        content: 'Code teaches you discipline, integrity, and patience. Learn how building software builds character and makes you a better human being.',
        excerpt: 'Writing code is not just a job skill-it is a practice in building unshakeable character traits.',
        author: 'Tari Godsproperty Pereowei',
        category: 'Philosophy',
        tags: ['character', 'code', 'philosophy', 'discipline', 'integrity'],
        image: 'img/blog/6.jpg',
        date: '2026-03-15',
        read_time: '10 min read',
        link: 'article-building-character.html',
        featured: false
    }
];

async function main() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM services');
        await client.query('DELETE FROM projects');
        await client.query('DELETE FROM blog_posts');

        for (const service of services) {
            await client.query(
                'INSERT INTO services (title, description, icon, features, updated_at) VALUES ($1, $2, $3, $4, NOW())',
                [service.title, service.description, service.icon, service.features]
            );
        }

        for (const project of projects) {
            await client.query(
                `INSERT INTO projects
                (title, description, image, category, tech, link, featured, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                [
                    project.title,
                    project.description,
                    project.image,
                    project.category,
                    project.tech,
                    project.link,
                    project.featured
                ]
            );
        }

        for (const post of blogPosts) {
            await client.query(
                `INSERT INTO blog_posts
                (title, content, excerpt, author, category, tags, image, date, read_time, link, featured, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
                [
                    post.title,
                    post.content,
                    post.excerpt,
                    post.author,
                    post.category,
                    post.tags,
                    post.image,
                    post.date,
                    post.read_time,
                    post.link,
                    post.featured
                ]
            );
        }

        await client.query('COMMIT');
        console.log(`Seeded services=${services.length}, projects=${projects.length}, blog_posts=${blogPosts.length}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Seeding failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

main();
