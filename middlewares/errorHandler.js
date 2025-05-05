function errorHandler(err, req, res, next) {
    console.error("🚀 ~ errorHandler ~ err:", err || err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const name = err.name || 'UnknownError';

    switch (err.name) {
        case 'ValidationError':
            return res.status(400).json({ name, message });
        case 'Unauthorized':
            return res.status(401).json({ name, message });
        case 'Forbidden':
            return res.status(403).json({ name, message });
        case 'NotFound':
            return res.status(404).json({ name, message });
        default:
            return res.status(statusCode).json({ message });
    }
}

module.exports = errorHandler;