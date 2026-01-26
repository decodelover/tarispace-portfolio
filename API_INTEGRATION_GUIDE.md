/**
 * BACKEND API INTEGRATION EXAMPLE
 * 
 * This file provides examples of how to connect the admin dashboard
 * to a backend API instead of using localStorage.
 * 
 * Technology: Node.js + Express + MongoDB
 * (Adapt to your chosen backend technology)
 */

// ============================================================================
// FRONTEND: Modified admin-dashboard.js function for API calls
// ============================================================================

const ApiClient = {
    baseURL: 'http://localhost:3000/api',
    
    // Include auth token with all requests
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        };
    },

    // PROFILE API CALLS
    async getProfile() {
        try {
            const response = await fetch(`${this.baseURL}/profile`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    async updateProfile(profileData) {
        try {
            const response = await fetch(`${this.baseURL}/profile`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(profileData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // SERVICES API CALLS
    async getServices() {
        try {
            const response = await fetch(`${this.baseURL}/services`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    async createService(serviceData) {
        try {
            const response = await fetch(`${this.baseURL}/services`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(serviceData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    async updateService(id, serviceData) {
        try {
            const response = await fetch(`${this.baseURL}/services/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(serviceData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    },

    async deleteService(id) {
        try {
            const response = await fetch(`${this.baseURL}/services/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },

    // PROJECTS API CALLS
    async getProjects() {
        try {
            const response = await fetch(`${this.baseURL}/projects`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    async createProject(projectData) {
        const formData = new FormData();
        Object.keys(projectData).forEach(key => {
            formData.append(key, projectData[key]);
        });

        try {
            const response = await fetch(`${this.baseURL}/projects`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    async deleteProject(id) {
        try {
            const response = await fetch(`${this.baseURL}/projects/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },

    // BLOG API CALLS
    async getBlogPosts() {
        try {
            const response = await fetch(`${this.baseURL}/blog`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            throw error;
        }
    },

    async createBlogPost(postData) {
        try {
            const response = await fetch(`${this.baseURL}/blog`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(postData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating blog post:', error);
            throw error;
        }
    },

    async updateBlogPost(id, postData) {
        try {
            const response = await fetch(`${this.baseURL}/blog/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(postData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating blog post:', error);
            throw error;
        }
    },

    async deleteBlogPost(id) {
        try {
            const response = await fetch(`${this.baseURL}/blog/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting blog post:', error);
            throw error;
        }
    },

    // MESSAGES API CALLS
    async getMessages() {
        try {
            const response = await fetch(`${this.baseURL}/messages`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    async deleteMessage(id) {
        try {
            const response = await fetch(`${this.baseURL}/messages/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },

    // SKILLS API CALLS
    async getSkills() {
        try {
            const response = await fetch(`${this.baseURL}/skills`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching skills:', error);
            throw error;
        }
    },

    async createSkill(skillData) {
        try {
            const response = await fetch(`${this.baseURL}/skills`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(skillData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating skill:', error);
            throw error;
        }
    },

    async deleteSkill(id) {
        try {
            const response = await fetch(`${this.baseURL}/skills/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting skill:', error);
            throw error;
        }
    }
};

// ============================================================================
// BACKEND: Node.js + Express Example Routes
// ============================================================================

/**
FILE: routes/portfolio.js

const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);
router.use(authorize('admin'));

// ===== PROFILE ROUTES =====
router.get('/profile', async (req, res) => {
    try {
        const profile = await Portfolio.findOne({ userId: req.user.id });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/profile', async (req, res) => {
    try {
        const profile = await Portfolio.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== SERVICES ROUTES =====
router.get('/services', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        res.json(portfolio.services || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/services', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        const newService = {
            id: Date.now(),
            ...req.body
        };
        portfolio.services.push(newService);
        await portfolio.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/services/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        const serviceIndex = portfolio.services.findIndex(s => s.id == req.params.id);
        portfolio.services[serviceIndex] = { ...portfolio.services[serviceIndex], ...req.body };
        await portfolio.save();
        res.json(portfolio.services[serviceIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        portfolio.services = portfolio.services.filter(s => s.id != req.params.id);
        await portfolio.save();
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== PROJECTS ROUTES =====
router.get('/projects', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        res.json(portfolio.projects || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/projects', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        const newProject = {
            id: Date.now(),
            ...req.body,
            image: req.file ? req.file.path : null
        };
        portfolio.projects.push(newProject);
        await portfolio.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        portfolio.projects = portfolio.projects.filter(p => p.id != req.params.id);
        await portfolio.save();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== BLOG ROUTES =====
router.get('/blog', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        res.json(portfolio.blog || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/blog', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        const newPost = {
            id: Date.now(),
            ...req.body,
            date: new Date().toISOString().split('T')[0]
        };
        portfolio.blog.push(newPost);
        await portfolio.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/blog/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        portfolio.blog = portfolio.blog.filter(b => b.id != req.params.id);
        await portfolio.save();
        res.json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== MESSAGES ROUTES =====
router.get('/messages', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        res.json(portfolio.messages || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/messages/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        portfolio.messages = portfolio.messages.filter(m => m.id != req.params.id);
        await portfolio.save();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== SKILLS ROUTES =====
router.get('/skills', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        res.json(portfolio.skills || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/skills', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        const newSkill = {
            id: Date.now(),
            ...req.body
        };
        portfolio.skills.push(newSkill);
        await portfolio.save();
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/skills/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user.id });
        portfolio.skills = portfolio.skills.filter(s => s.id != req.params.id);
        await portfolio.save();
        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
*/

// ============================================================================
// ENVIRONMENT VARIABLES (.env)
// ============================================================================

/**
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key-here
*/

// ============================================================================
// USAGE IN ADMIN DASHBOARD
// ============================================================================

/**
// Replace the saveProfile function in admin-dashboard.js with:

async saveProfile() {
    try {
        const profileData = {
            fullName: document.getElementById('fullName').value,
            title: document.getElementById('title').value,
            bio: document.getElementById('bio').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            experience: parseInt(document.getElementById('experience').value),
            linkedinUrl: document.getElementById('linkedinUrl').value,
            githubUrl: document.getElementById('githubUrl').value,
            twitterUrl: document.getElementById('twitterUrl').value
        };

        const result = await ApiClient.updateProfile(profileData);
        this.showToast('Profile updated successfully!');
    } catch (error) {
        this.showToast('Error saving profile: ' + error.message);
    }
}

// Similar changes for all CRUD operations
*/

console.log('Backend API integration examples provided');
