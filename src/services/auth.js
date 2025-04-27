const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const checkSession = async () => {
    try{
        const res = await fetch(`${BASE_URL}/auth/me`, {
            credentials: 'include',
        })

        if(!res.ok) {
            if(res.status ==- 401){
                return null;
            }
            throw new Error("Server error");
        }

        return await res.json();
    }
    catch(err){
        console.error("Session check failed",err);
        return null;
    }
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

export const logout = async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`,{
        method: 'GET',
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
}

export const getProducts = async () => {
    const res = await fetch(`${BASE_URL}/api/products`)
    return res.json();
}

export const createProduct = async (product) => {
    const res = await fetch (`${BASE_URL}/api/products`, {
        method: 'POST',
        body: product,
        credentials: "include"
    })
    return res.ok ? res.json() : null;
}

export const updateProduct = async (product, id) => {
    const res = await fetch (`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        body: product,
        credentials: "include"
    })
    return res.ok ? res.json() : null;
}

export const deleteProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/api/products/${id}`,{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })
    return res.ok ? res.json() : null;
}