import { dater, formatter } from "./utility.js"

let haTblHdrs = { 'propertyID' : "Property #"}
    haTblHdrs['accountID'] = 'Acct #'
    haTblHdrs['accountName'] = 'Name'
    haTblHdrs['accountStatus'] = 'Status'
    haTblHdrs['dateCreated'] = 'Created'
    haTblHdrs['isPrivate'] = 'Private?'



export function dispHaList(data) {
    let rowCnt = data.length
    let gstTblDiv = document.getElementById('haTblDiv')

    console.log('dispHaList: data: ', rowCnt, ' : ', data)
    
    // if no data returned, display message and return
    if (rowCnt === 0) {
        haTblDiv.innerHTML = '<b>No House Account with that name</b>'
        return 0
    }
    // if data returned, display table
    // let colCnt = Object.keys(data[0]).length


    // console.log('colCnt: ', colCnt)
// return 0
    // will be putting the results into a table
    let newTable = "<table border='0' id='gstTbl'>"
    // if (Array.isArray(data)) {
        // create table header
        newTable += "<thead>"
        newTable += "<tr>"
        for (let key in haTblHdrs) {
            newTable += "<th>" + haTblHdrs[key] + "</th>"
        }
        newTable += "</tr>"
        newTable += "</thead>"
        // create table rows
        for (let i = 0; i < rowCnt; i++) {
            newTable += "<tr>"
            for (let key in haTblHdrs) {
                // console.log('key: ', key, '  data[i][key]: ', data[i][key])
                // don't show data for this, just visual indicator
                 if (key === 'NAOP') {
                    if (data[i][key] === 1) {
                        newTable += "<td class='do-not-rent'>" + 'NAOP' + "</td>"
                    } else {
                        newTable += "<td>" + 'OK' + "</td>"
                    }
                    // newTable += "<td>" + data[i][key] + "</td>"
                } else if 
                    (key === 'dateCreated' ) {
                        let newDate = dater(data[i]['dateCreated'])
                        newTable += "<td>" + newDate + "</td>"
                } else
                    newTable += "<td>" + data[i][key] + "</td>"            
            }
            newTable += "</tr>"
        }
    // }
    newTable += '</table>'
    gstTblDiv.innerHTML = newTable

    return rowCnt
}


