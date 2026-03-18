CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) DEFAULT '',
    title VARCHAR(255) DEFAULT '',
    bio TEXT DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(100) DEFAULT '',
    location VARCHAR(255) DEFAULT '',
    experience INTEGER DEFAULT 0,
    specialty VARCHAR(255) DEFAULT '',
    focus VARCHAR(255) DEFAULT '',
    profile_image TEXT DEFAULT '',
    about_image TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    twitter_url TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    whatsapp_number VARCHAR(100) DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    icon VARCHAR(100) DEFAULT '',
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    category VARCHAR(100) DEFAULT '',
    tech VARCHAR(255) DEFAULT '',
    link TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    excerpt TEXT DEFAULT '',
    author VARCHAR(255) DEFAULT '',
    category VARCHAR(150) DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    image TEXT DEFAULT '',
    date DATE,
    read_time VARCHAR(100) DEFAULT '',
    link TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT '',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    enable_comments BOOLEAN DEFAULT TRUE,
    show_contact_form BOOLEAN DEFAULT TRUE,
    enable_newsletter BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    visit_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_settings
ADD COLUMN IF NOT EXISTS visit_count INTEGER NOT NULL DEFAULT 0;
