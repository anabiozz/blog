import state from './config.state';

const config = {
    server: {
        production: '127.0.0.1',
        develop: '127.0.0.1',
        port: 8091
    },
    database: {
        host: '127.0.0.1',
        db: 'blog'
    },
    initialState: state
};

export default config;