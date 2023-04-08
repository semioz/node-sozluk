import mongoose from "mongoose";
import * as redis from "redis";


declare module "mongoose" {
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
        cache():this;
        useCache:boolean;
    }
}

const client = redis.createClient({url:process.env.REDIS_URL});

client.on("connect", () => console.log("Redis Connection Is Successful!"));
client.on("err", (err) => console.log("Redis Client Error:", err));
client.connect();

//Hooking into mongoose's query generation and execution process
//in order to make the caching reusable in the codebase
const exec = mongoose.Query.prototype.exec;

//cache()
mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if(!this.useCache){
        return exec.apply(this);
    };

    const key = JSON.stringify(
        Object.assign({},this.getQuery(),{collection:this.mongooseCollection.name})
        );

    //See if we have a value for "key" in redis:
    const cacheValue = await client.get(key);

    //If we do, return that
    if(cacheValue){
        const doc = JSON.parse(cacheValue);
        return Array.isArray(doc) 
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
    };

    //Otherwise, issue the query and store the result in redis:
    const result = await exec.apply(this);
    client.set(key,JSON.stringify(result),{EX:10,NX:true});
    return result;
};