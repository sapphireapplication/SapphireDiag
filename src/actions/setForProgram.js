export const setForProgram = (param) => async (dispatch) => {
  //   let pgmid = paramid.join("+").split("+")[0];
  //   let entid = paramid.join("+").split("+")[1];
  //   let pgmtx = paramtxt.join("+").split("+")[0];
  //   let enttx = paramtxt.join("+").split("+")[1];

  //   console.log("action for program==", pgmid, entid, pgmtx, enttx);
  //   if (entid === undefined) {
  //     dispatch({
  //       type: "FETCH_FORPROGRAM",
  //       payload: { firstid: pgmid, firsttx: pgmtx },
  //     });
  //   } else {
  //     dispatch({
  //       type: "FETCH_FORPROGRAM",
  //       payload: {
  //         firstid: pgmid,
  //         secondid: entid,
  //         firsttx: pgmtx,
  //         secondtx: enttx,
  //       },
  //     });
  //   }
  // };

  console.log("inside setprogram action==", param);

  // let ids = paramid.join("+").split("+");

  // let texts = paramtxt.join("+").split("+");

  // let arr = [];
  // ids.map((item, idx) => {
  //   arr.push({ id: item, text: texts[idx] });
  // });

  dispatch({
    type: "FETCH_FORPROGRAM",
    payload: param,
  });
};
