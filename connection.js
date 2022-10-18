// Conexión Knex
const options = {
    mysql: {
        client: "mysql",
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'ecommerce'
        },
        pool: { min: 0, max: 10 }
    },
    sqlite3: {
        client: "sqlite3",
        connection: {
            filename: "./DB/mydb.sqlite"
        },
        useNullAsDefault: true
    }
};

module.exports = { options };

