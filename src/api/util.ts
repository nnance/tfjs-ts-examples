const host = 'localhost'
const port = '8080'

export async function callAPI<T, U>(url = '', data: T): Promise<U> {
    // Default options are marked with *
    const response = await fetch(`http://${host}:${port}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return response.json() // parses JSON response into native JavaScript objects
}
