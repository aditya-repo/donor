const corsConfig = {
    origin: 'http://localhost:4040',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}

module.exports = corsConfig