module.exports = {
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'root',
        database: process.env.DATABASE_NAME || 'mypassword'
    },
    port: process.env.PORT || 8080
};

