module.exports = {
    "development": {
        "servers": {
            "proxy": "/api/"
        }
    },
    "production": {
        servers: {
            "proxy": ""
        }
    }
}[process.env.NODE_ENV || "production"];