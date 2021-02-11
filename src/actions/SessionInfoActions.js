import apis from "../apis";

export const setSessionInfo = () => async dispatch => {
    const data = await apis.get('/getSessionData')

    console.log('Session info', data.data.content)
    dispatch ({
        type: 'SET_SESSION_INFO',
        payload: {
            jobNumber: data.data.content.jobNumber,
            middlewareRequestTime: data.data.content.middlewareRequestTime,
            middlewareResponseTime: data.data.content.middlewareResponseTime,
            timeStored: data.data.content.timeStored,
            totalTime: data.data.content.totalTime
        }
    })
}