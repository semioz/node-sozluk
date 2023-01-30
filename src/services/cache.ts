import * as redis from "redis";
import mongoose from "mongoose";

const client = redis.createClient({ url: process.env.REDIS });

client.on("connect", () => console.log("Redis Connection Is Successful!"));
client.on("err", (err) => console.log("Redis Client Error:", err));
client.connect();

//Hooking into mongoose's query generation and execution process
//in order to make the caching reusable in the codebase
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
    const key = JSON.stringify(
        Object.assign({},this.getQuery(),{collection:this.mongooseCollection.name})
        );

    //See if we have a value for "key" in redis:
    const cacheValue = await client.get(key);

    //If we do, return that
    if(cacheValue){
        console.log("Serving from cache");
        console.log(cacheValue);
        return cacheValue;
    }

    //Otherwise, issue the query and store the result in redis:
    const result = await exec.apply(this);
    client.set(key,JSON.stringify(result));
    return result;
};

//Toggleable Cache