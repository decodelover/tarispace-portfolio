require('dotenv').config();

async function main() {
    const base = `http://127.0.0.1:${process.env.PORT || 4000}/api`;

    const health = await fetch(`${base}/health`);
    if (!health.ok) {
        throw new Error(`Health check failed (${health.status})`);
    }

    const login = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: process.env.DEFAULT_ADMIN_PASSWORD
        })
    });

    if (!login.ok) {
        throw new Error(`Login failed (${login.status})`);
    }

    const auth = await login.json();
    const token = auth.token;
    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };

    const marker = `E2E-${Date.now()}`;
    const serviceTitle = `E2E Service ${marker}`;

    const createService = await fetch(`${base}/services`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            title: serviceTitle,
            description: 'sync-check',
            icon: 'la-check',
            features: ['sync', 'test']
        })
    });

    if (!createService.ok) {
        throw new Error(`Create service failed (${createService.status})`);
    }

    const createdService = await createService.json();

    const siteDataRes = await fetch(`${base}/public/site-data`);
    if (!siteDataRes.ok) {
        throw new Error(`Public site-data failed (${siteDataRes.status})`);
    }

    const siteData = await siteDataRes.json();
    const reflected = (siteData.services || []).some((s) => s.title === serviceTitle);

    const messageSubject = `E2E Subject ${marker}`;
    const messageBody = `single insert test ${marker}`;

    const sendMessage = await fetch(`${base}/public/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'E2E Contact',
            email: 'e2e@example.com',
            subject: messageSubject,
            message: messageBody
        })
    });

    if (!sendMessage.ok) {
        throw new Error(`Public message failed (${sendMessage.status})`);
    }

    const messagesRes = await fetch(`${base}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!messagesRes.ok) {
        throw new Error(`Load messages failed (${messagesRes.status})`);
    }

    const messages = await messagesRes.json();
    const matchingMessages = messages.filter(
        (m) => m.subject === messageSubject && m.message === messageBody
    ).length;

    const deleteService = await fetch(`${base}/services/${createdService.id}`, {
        method: 'DELETE',
        headers: authHeaders
    });

    if (!deleteService.ok) {
        throw new Error(`Cleanup service failed (${deleteService.status})`);
    }

    const result = {
        health: health.status,
        login: login.status,
        reflected,
        matchingMessages,
        createdServiceId: createdService.id
    };

    console.log(JSON.stringify(result, null, 2));

    if (!reflected) {
        throw new Error('Service change was not reflected in public site-data');
    }

    if (matchingMessages !== 1) {
        throw new Error(`Expected 1 matching contact message, got ${matchingMessages}`);
    }
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
