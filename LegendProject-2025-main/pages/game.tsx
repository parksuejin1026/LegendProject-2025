import React from 'react';
import App from '../src/App';
import { NextPage } from 'next';

const GamePage: NextPage = () => {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
};

export default GamePage;
