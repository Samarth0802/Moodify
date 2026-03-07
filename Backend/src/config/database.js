const mongoose = require('mongoose')

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected To Database")
    } catch (err) {
        console.log("Database connection error:", err)
        process.exit(1)
    }
}

module.exports = connectToDB