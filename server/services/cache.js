import redis from "redis";
import mongoose from "mongoose";
import util from "util";

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.hGet = util.promisify(client.hGet);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || "");

    return this
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    //See if we have a value for "key" in redis
    const cacheValue = await client.hget(this.hashKey, key);

    //If we do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? doc.map(el => new this.model(el)) : new this.model(doc);
    }
    //Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));
    client.expire(this.hashKey, 10);

    return result
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
};