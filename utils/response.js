export function makeError(error) {
    const data = null;

    return {data, error}
}

export function makeSuccess(data){
    const error = null;

    return {data, error}
}

export function makeResponse(req, method){
    const url = new URL(req.url);
    const request = Object.fromEntries(url.searchParams)
    
    return { method, request }
}

export function ensureRequestContains(response, field, err){
    if(!response.request[field]){
        response.error = err
    }

    return response
}

export async function executeAndStoreResult(response, fn){
    if(!response.error){
        const { data, error } = await fn(); 

        response.data = data;
        response.error = error;    
    }

    return response
}