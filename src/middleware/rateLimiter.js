const IORedis = require("ioredis");

const redis = new IORedis({
    host: "redis",
    port:6379
});

const rateLimiter = async(req,res,next) => {
    try {
        const userId = req.user.id;

        const key = `rate:${userId}`;

        const count = await redis.incr(key);

        if(count ===1) {
            await redis.expire(key,60);
          }
        if(count > 5) {
            return res.status(500).json({
                error: "Too many requests. Try again later",
            });
        }

        next();
    } catch(err) {
        console.error("rate limiter error:",err);
        next();
    }
};


module.exports = rateLimiter;


