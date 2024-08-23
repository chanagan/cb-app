// import { ha_accts } from "./data_sets/ha_accts.js";
import { dispHaList } from "./js/dispHaList.js";
// import { dispGstDtl } from "./dispGstSrchDtl.js";
// import { dispGstResList } from "./dispGstResList.js";
// import { dispGstResDtl } from "./dispGstResDtl.js";
// import { dispGstStaysList } from "./dispGstStaysList.js";
// import { dispGstStaysDtl } from "./dispGstStaysDtl.js";

let ha_accts = {};

const clearInfoBlocks = () => { 
  let dispElems = document.getElementsByClassName("gstDisp"); 
  for (let i = 0; i < dispElems.length; i++) { 
    dispElems[i].innerHTML = ""; 
    // dispElems[i].classList.add("do-not-show");
  }
}

const clearHighlight = () => {  
  let dispElems = document.getElementsByClassName("highlight"); 
  for (let i = 0; i < dispElems.length; i++) { 
    dispElems[i].classList.remove("highlight"); 
  }
}

const clearSelections = () => {
  clearHighlight();
  clearInfoBlocks();
}

let qryKeyVIP;

/**
 * set up the swap window buttons
 */

// btnSwitch2HA.addEventListener("click", () => {
//   // console.log("btnSwitch clicked");
//   api.send("switch2HA");
// });

/*
 * Clicked on the search button
 */
btnHASearch.addEventListener("click", () => {
//   let srchID = document.getElementById("gstSearch").value;
let srchID = 'all'
  clearInfoBlocks();
//   // for (let i = 0; i < dispElems.length; i++) {
//   //   dispElems[i].innerHTML = "";
//   // }
//   // console.log(srchID);
  // alert('click: ')
  api.send("haList", srchID);
});

/*
 * get the search results back from preload.js
 */
let rowCnt = 0;
window.addEventListener("message", (event) => {
  // console.log('renderer: ', event.data);
  if (event.data.type === "haList") {
    console.log('renderer: ', event.data.data);
    ha_accts = event.data.data;
    // return
    clearSelections();

    // go show results of the guest search
    rowCnt = dispHaList(event.data.data);
    // console.log('rowCnt: ', rowCnt);
    
    let cntRes = document.getElementById("cntRes");
    cntRes.innerHTML = "Number of guests found: <b>" + rowCnt + "</>";

    return

    if (rowCnt > 0) {
      let gstTbl = document.getElementById("gstTbl");
      gstTbl.addEventListener("click", (e) => {
        clearSelections();
        let thisTR = e.target.parentNode;
        thisTR.classList.add("highlight");
        // e.target.parentNode.classlist.add("hightlight");
        // console.log("thisTR: ", thisTR);

        let row = e.target.parentNode.rowIndex;
        let col = e.target.cellIndex;
        // gstTbl.rows[row].cells[0].classList.add("highlight");
        let cellData = gstTbl.rows[row].cells[0].innerHTML;
        qryKeyVIP = cellData;
        // console.log("row: ", row, "  col: ", col, "  cellData: ", cellData);
        api.send("gstDetail", qryKeyVIP);
        api.send("gstReserves", qryKeyVIP);
        api.send("gstStays", qryKeyVIP);
      });
    }
  }

  /**
   * fill in the guest detail
   */
  if (event.data.type === "gstDetail") {
    // console.log("gstDetail: ", event.data.data);
    dispGstDtl(event.data.data);
  }

  // console.log('renderer: ', event.data);
  if (event.data.type === "rGstReserve") {
    // console.log('renderer: ', event.data.data);
    rowCnt = dispGstResList(event.data.data);
    // console.log('rowCnt: ', rowCnt);
    // let cntRes = document.getElementById("cntRes");
    // cntRes.innerHTML = "Number of guests found: <b>" + rowCnt + "</>";
    let gstTbl = document.getElementById("gstResTbl");
    if (rowCnt === 0) {
      // gstTbl.innerHTML = "<b>No reservations found</b>";
    } else {
      gstTbl.addEventListener("click", (e) => {
        // clear the highlight
        let thisTR = e.target.parentNode;
        let prevHighLight = thisTR.parentElement.querySelector('.highlight')
        if (prevHighLight !== null) {
          prevHighLight.classList.remove("highlight");
        }
        // highlight the row
        thisTR.classList.add("highlight");

        let row = e.target.parentNode.rowIndex;
        let col = e.target.cellIndex;
        let cellData = gstTbl.rows[row].cells[0].innerHTML;
        // console.log("cellgstReserveData: ", cellData, e);
        // qryKeyVIP = cellData;
        // console.log("row: ", row, "  col: ", col, "  cellData: ", cellData);
        api.send("mGstResDetail", cellData);
      });
    }
  }

  if (event.data.type === "gstResDetail") {
    // console.log("gstResDetail: ", event.data.data);
    dispGstResDtl(event.data.data);
  }

  if (event.data.type === "gstStays") {
    // console.log("gstStays: ", event.data.data);
    rowCnt = dispGstStaysList(event.data.data);
    let gstTbl = document.getElementById("gstStaysTbl");

    if (rowCnt === 0) {
      // gstTbl.innerHTML = "<b>No stays found</b>";
    } else {
      gstTbl.addEventListener("click", (e) => {
        // clear the highlight
        let thisTR = e.target.parentNode;
        let prevHighLight = thisTR.parentElement.querySelector('.highlight')
        if (prevHighLight !== null) {
          prevHighLight.classList.remove("highlight");
        }
        // highlight the row
        thisTR.classList.add("highlight");

        let row = e.target.parentNode.rowIndex;
        let col = e.target.cellIndex;
        let cellData = gstTbl.rows[row].cells[0].innerHTML;
        // console.log("cellgstReserveData: ", cellData, e);
        // qryKeyVIP = cellData;
        // console.log("row: ", row, "  col: ", col, "  cellData: ", cellData);
        api.send("gstStayDetail", cellData);
      });
    }
  }

    if (event.data.type === "gstStayDetail") {
        // console.log("gstStayDetail: ", event.data.data);
        dispGstStaysDtl(event.data.data);
    }
}
);

