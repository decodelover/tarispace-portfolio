module.exports = {
    apps: [
        {
            name: 'tarispace-api',
            script: 'src/app.js',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: 4000
            }
        }
    ]
};
