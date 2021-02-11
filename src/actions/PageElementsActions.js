export const setPageElementsState = (id, val) => async (dispatch) => {
    dispatch({
        type: 'SET_'+id,
        payload: val
    })
}