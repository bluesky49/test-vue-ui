const api = 'http://localhost:3000'
export const makeRequest = async (endpoint, method, data) => {
    const option = method === "GET" ? 
        { method } : 
        {
            method, 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({data})
        }
    const resJson = await fetch(`${api}/${endpoint}`, option);
    const res = await resJson.json();
    return res.data;
}