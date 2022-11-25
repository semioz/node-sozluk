import { clearHash } from "../services/cache.js";

export default async(req, res, next) => {
    await next();
    clearHash(req.params.nickname);
}