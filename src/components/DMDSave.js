

export const savePositions = (entName, pos) => {

    const data = JSON.stringify({ entName, pos })
    const endpoint = `${SERVERADDR}/EntPos/${DBNAME}/${data}`
    const requestOptions = {
        method: 'POST',
        headers: [
            ["Content-Type", "application/json"],
            ["Content-Type", "text/plain"]
        ],
        mode: "cors",
        data: data,
        body: data

    };
    fetch(endpoint, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.info('fetch()', data)
            return data
        })


    console.log( pos);
}
