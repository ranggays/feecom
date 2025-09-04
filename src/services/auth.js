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
};

export const register = async (user) => {
    const res = await fetch(`${BASE_URL}/auth/register`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
};

export const loginLocal = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
};

export const logout = async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`,{
        method: 'GET',
        credentials: 'include',
    })
    return res.ok ? res.json() : null;
};

export const getProducts = async () => {
    const res = await fetch(`${BASE_URL}/api/products`)
    return res.json();
};

export const getProductById = async (id) => {
    const res = await fetch (`${BASE_URL}/api/products/${id}`);
    if (!res.ok){
        if (res.status === 404){
            throw new Error ('Product not found');
        }
        throw new Error('Failed to fetch product details');
    }
    return res.json();
}

export const createProduct = async (product) => {
    const res = await fetch (`${BASE_URL}/api/products`, {
        method: 'POST',
        body: product,
        credentials: "include"
    })
    return res.ok ? res.json() : null;
};

export const updateProduct = async (product, id) => {
    const res = await fetch (`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        body: product,
        credentials: "include"
    })
    return res.ok ? res.json() : null;
};

export const deleteProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/api/products/${id}`,{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })
    return res.ok ? res.json() : null;
};

export const getCart = async () => {
    const res = await fetch(`${BASE_URL}/api/cart`, {
        credentials: "include"
    });
    return res.json();
    // const data = await res.json();
    // console.log("getCart() response:", data); // Tambahkan log ini

      // Jika respons adalah array, langsung kembalikan
    // return data;
};

export const createCart = async (productId, quantity) => {
    const res = await fetch(`${BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
            quantity: quantity,
        }),
        credentials: 'include'
    })
    return res.ok ? res.json() : null;
};

export const updateCart = async (id, quantity) => {
    const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity}),
        credentials: 'include'
    })
    return res.ok ? res.json() : null;
};

export const deleteCart = async (id) => {
    const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: 'include'
    })
    return res.ok ? res.json() : null;
};

export const getOrder = async () => {
    const res = await fetch(`${BASE_URL}/api/order`, {
        credentials: "include"
    });
    return res.json();
};

export const getOrderId = async (id) => {
    const res = await fetch(`${BASE_URL}/api/order/${id}`, {
        credentials: "include"
    });
    return res.json();
};

export const createOrder = async (data) => {
    const res = await fetch (`${BASE_URL}/api/order`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
    return res.ok ? res.json() : null;
};

export const updateOrder = async (status, id) => {
    const res = await fetch(`${BASE_URL}/api/order/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({status}),
        credentials: "include"
    });
    return res.ok ? res.json() : null;
};

export const deleteOrder = async (id) => {
    const res = await fetch(`${BASE_URL}/api/order/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: "include"
    });
    return res.ok ? res.json() : null;
};

export const getCategory = async () => {
    const res = await fetch(`${BASE_URL}/api/categories`, {
        credentials: "include"
    });
    return res.json();
};

export const createCategory = async (name) => {
    const res = await fetch(`${BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({name})
    })
    return res.ok ? res.json() : null;
}