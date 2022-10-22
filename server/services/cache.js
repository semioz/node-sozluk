import redis from "redis";
import mongoose from "mongoose";
import util from "util";

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.hGet = util.promisify(client.hGet);
const exec = mongoose.Query.prototype.exec;