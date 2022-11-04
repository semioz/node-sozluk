import redis from "redis";
import mongoose from "mongoose";
import util from "util";

const redisUrl = process.env.REDIS;
const client = redis.createClient(redisUrl);

client.on("connect", () => console.log("Redis Connection Is Successful!"));
client.on("err", (err) => console.log("Redis Client Error:", err));
await client.connect()

//client.hGet = util.promisify(client.hGet) ?????
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "Default");

    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments)
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }))

    //See, if we have a value for key in redis.
    const cacheValue = await client.hGet(this.hashKey, key);

    //If we do, return that
    if (cacheValue) {
        const doc = new this.model(JSON.parse(cacheValue))
        return Array.isArray(doc) ? doc.map(el => new this.model(el)) : new this.model(doc)
    }

    const result = await exec.apply(this, arguments);

    client.hSet(this.hashKey, key, JSON.stringify(result), "EX", 10);
    return result;
};

export default function clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
}