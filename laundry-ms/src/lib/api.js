const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
    baseUrl: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
    }
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                ...options.headers
            },
            credentials: 'include',
            ...options
        };

        const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                // window.location.href = '/login';
                throw new Error('Please login to access this resource');
            }
            const error = await response.json();
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchWithApiKey = async (endpoint, options = {}) => {
    try {
        const defaultOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': API_KEY
            },
            mode: 'cors',
            ...options,
            headers: {
                ...options.headers,
                'X-API-Key': API_KEY
            }
        };

        const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};