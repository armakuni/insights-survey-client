
function fetchJSONResponse(err, status, data) {

    return { err, status, data };

}

export async function fetchJSON(url) {

    try {

        const resp = await fetch(url);
        if (!resp.ok) {

            let json;
            try {
                json = await resp.json();
            } catch (err) {
                console.warn(err);
            }
            const err = Error(json?.message || `Response status: ${resp.status}`);
            err.resp = resp;
            throw err;

        }
        return fetchJSONResponse(
            null,
            resp.status,
            await resp.json()
        );

    } catch (err) {

        return fetchJSONResponse(
            new Error(`Failed for ${url}. ${err.toString().replace(/Error: /, "")}`),
            err.resp?.status || 400
        );

    }

}
