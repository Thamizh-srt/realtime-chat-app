import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import app from './server.js';
import { initSocket } from './sockets/index.js';
import logger from './utils/logger.js';

const server = createServer(app);

initSocket(server);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const shutdown = () => {
    logger.info('Shutdown signal received — closing server gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);