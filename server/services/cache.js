import redis from "redis";
import mongoose from "mongoose";

const redisUrl = process.env.REDIS;
const client = redis.createClient(redisUrl);

client.on("connect", () => console.log("Redis Connection Is Successful!"));
client.on("err", (err) => console.log("Redis Client Error:", err));
await client.connect()

//Hooking into mongoose's query generation and execution process
//in order to make the caching reusable in the codebase
const exec = mongoose.Query.prototype.exec;

//Toggleable Cache
mongoose.Query.prototype.cache = async function(options = {}) {
    this.useCache = true;
    //Hashkey for the top level property
    this.hashKey = JSON.stringify(options.key || "default");
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))

    //Hget, gets 2 property.
    //First one, is the hashkey(which is the top level property) and field key as the second argument.
    const cacheValue = await client.hGet(this.hashKey, key);
    //If we do have, then return it
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? doc.map(el => new this.model(el)) : new this.model(doc);
    }

    //Otherwise, issue the query and store the result in the redis. 
    const result = await exec.apply(this, arguments)
        //Hset also needs the top level property as the first arguments for sure!
    client.hSet(this.hashKey, key, JSON.stringify(result), "EX", 10);
    return result;
}

export const clearHash = function(hashkey) {
    client.del(JSON.stringify(clearHash));
}