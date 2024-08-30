import { dater, formatter, statusFlag } from "./utility.js";

let tblHdrs = { reservationID: "Res ID" };
tblHdrs["guestName"] = "Guest Name";
tblHdrs["nights"] = "Nights";
tblHdrs["startDate"] = "Check In";
tblHdrs["endDate"] = "Check Out";
tblHdrs["adults"] = "Adults";
// tblHdrs['isPrivate'] = 'Private?'

/**
 * let jData = [
  { name: "GeeksforGeeks", est: 2009 },
  { name: "Google", est: 1998 },
  { name: "Microsoft", est: 1975 }
];
jData.sort((a, b) => (a.name > b.name ? 1 : -1));
console.log(jData);
 */

/**
 *
 * @param {*} data
 * @returns rowCnt
 */

export function dispResList(data) {
    let rowCnt = data.length;
    let haTblDiv = document.getElementById("resListDiv");

    // if no data returned, display message and return
    if (rowCnt === 0) {
        haTblDiv.innerHTML = "<b>No Reservations</b>";
        return 0;
    }
    // console.log("dispResList: data: ", rowCnt, " : ", data);

    // sort the data by startDate
    data.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
    console.log("dispResList: data: ", rowCnt, " : ", data);

    // compute the number of nights
    for (let i = 0; i < rowCnt; i++) {
        let sDate = new Date(data[i].startDate);
        let eDate = new Date(data[i].endDate);
        let diffTime = Math.abs(eDate - sDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        data[i].nights = diffDays;
    }
    console.log("dispResList: data: ", rowCnt, " : ", data);

    // if data returned, display table

    // will be putting the results into a table
    let displayCnt = 0;
    let newTable = "<table border='0' id='listTbl'>";
    // if (Array.isArray(data)) {
    // create table header
    newTable += "<thead>";
    newTable += "<tr>";
    for (let key in tblHdrs) {
        newTable += "<th>" + tblHdrs[key] + "</th>";
    }
    newTable += "</tr>";
    newTable += "</thead>";
    // create table rows
    for (let i = 0; i < rowCnt; i++) {
        // newTable += "<tr>";
        let resStatus = data[i].nights < 6 ? data[i].status : "vip";

        if (statusFlag(resStatus)) {
            displayCnt++;
            let resID = data[i].reservationID;
            let newRow = `<tr class='${resStatus}' data-resID=${resID}>`;
            newTable += newRow;
            for (let key in tblHdrs) {
                switch (key) {
                    case "startDate":
                        newTable += "<td>" + dater(data[i][key]) + "</td>";
                        break;
                    case "endDate":
                        newTable += "<td>" + dater(data[i][key]) + "</td>";
                        break;
                    default:
                        newTable += "<td>" + data[i][key] + "</td>";
                        break;
                }
            }
            newTable += "</tr>";
        }
    }

    // }
    newTable += "</table>";
    haTblDiv.innerHTML = newTable;

    return displayCnt;
}
