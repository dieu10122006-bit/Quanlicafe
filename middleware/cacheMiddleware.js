const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

exports.cacheMiddleware = (duration) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            console.error('Cannot cache non-GET methods!');
            return next();
        }
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            console.log(`Cache hit for ${key}`);
            return res.json(cachedResponse);
        } else {
            console.log(`Cache miss for ${key}`);
            res.originalJson = res.json;
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cache.set(key, body, duration);
                }
                res.originalJson(body);
            };
            next();
        }
    };
};

exports.clearCachePrefix = (prefix) => {
    const keys = cache.keys();
    for (const key of keys) {
        if (key.startsWith(prefix)) {
            cache.del(key);
        }
    }
};
