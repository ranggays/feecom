const BASE_URL = process.env.REACT_APP_API_URL;

export const checkSession = async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
}

export const register = async (user) => {
    const res = await fetch(`${BASE_URL}/auth/register`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
}

export const loginLocal = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
}