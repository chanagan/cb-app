// import { ha_accts } from "./data_sets/ha_accts.js";
// import { dispHaList } from "./js/dispHaList.js";
// import { dispGstDtl } from "./dispGstSrchDtl.js";
// import { dispGstResList } from "./dispGstResList.js";
// import { dispGstResDtl } from "./dispGstResDtl.js";
// import { dispGstStaysList } from "./dispGstStaysList.js";
// import { dispGstStaysDtl } from "./dispGstStaysDtl.js";



import {dispResList} from "./js/dispResList.js";
import {dispResDetail} from "./js/dispResDetail.js";

let ha_accts = {};
let resList = {};

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

hdrStatusChecks.addEventListener("click", (event) => {
  console.log("hdrStatus clicked");
  const el = document.querySelector("#resListDiv");
  const allRows = el.querySelectorAll("tr.checked_in");
  allRows.forEach((row) => {
    row.style.visibility = "hidden";
  });
});

// btnSwitch2HA.addEventListener("click", () => {
//   // console.log("btnSwitch clicked");
//   api.send("switch2HA");
// });

/*
 * Clicked on the search button
 */
btnDateSearch.addEventListener("click", () => {
  let resDateFrom = document.getElementById("resDateFrom").value;
  let resDateTo = document.getElementById("resDateTo").value;
// let srchID = 'all'
  clearInfoBlocks();

  api.send("resList", {resDateFrom, resDateTo}); // send to main
});

/*
 * get the search results back from preload.js
 */
let rowCnt = 0;
window.addEventListener("message", (event) => {
  
  /**
   * have a list of reservations from main=>preload=>renderer
   */
  if (event.data.type === "resData") {
    // console.log('renderer: ', event.data.data);
    resList = event.data.data;
    // return
    clearSelections();

    // go show results of the guest search
    // rowCnt = dispResList(event.data.data);
    rowCnt = dispResList(resList);
    // console.log('rowCnt: ', rowCnt);
    
    let cntRes = document.getElementById("cntRes");
    cntRes.innerHTML = "Number of reservations found: <b>" + rowCnt + "</>";

    // return

    if (rowCnt > 0) {
      let listTbl = document.getElementById("listTbl");

      // this will fire when the table is clicked
      listTbl.addEventListener("click", (e) => {
        clearSelections();
        let thisTR = e.target.parentNode;

        let reservationID = thisTR.getAttribute("data-resID");
        thisTR.classList.add("highlight");

        // let col = e.target.cellIndex;
        let dispSelName = document.getElementById("dispSelName");
        let row = e.target.parentNode.rowIndex;
        let selName = listTbl.rows[row].cells[1].innerHTML;
        dispSelName.innerHTML = 'Selected Guest: ' + selName;

        console.log("row: ", row, "  cellData: ", reservationID);

        api.send('getResDetail', reservationID);
        // api.send("gstDetail", qryKeyVIP);
        // api.send("gstReserves", qryKeyVIP);
        // api.send("gstStays", qryKeyVIP);
      });
    }
  }

  if (event.data.type === "gotResDetail") {
    console.log('renderer: ', event.data.data);
    let resData = event.data.data;
    dispResDetail(resData);
  }
}
);

