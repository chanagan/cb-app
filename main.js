const { app, BrowserWindow, ipcMain } = require("electron");
const { get } = require("http");
const fetch = require("electron-fetch").default;

const path = require("path");
// // const sqlite3 = require("sqlite3").verbose();
// // const db = new sqlite3.Database("./db/rm-test.db");
// const findGst = require("./sql/sql.js");
// const findHA = require("./sql/sql_ha.js");

// let {ha_accts} = require("./data_sets/ha_accts.js");
// import { ha_accts } from "./data_sets/ha_accts";    

let ha_accts;  // this is the global variable for the house accounts
let resWindow, resData; 

const winWidth = 1200;
const winHeight = 900;
const winX = 0;
const winY = 0;

let window;

const createWindow = () => {
    window = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: winX,
        y: winY,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    window.loadFile("index.html");
    // console.log('in main.js: ', window)

    window.webContents.openDevTools({
        mode: "detach",
        width: 1200,
        height: 900,
        x: 900,
        y: 100,
        show: true,
    });
};

app.whenReady().then(() => {
    createWindow();
    window.once("ready-to-show", () => {
        window.show();
        // getHAList();
        getResList();
    });
});

/**
 * once the window is open, fetch the list of house accounts
 * - this is a one-time fetch
 * - the list is used to populate the dropdown
 */

const cbPropertyID = "310046";
const cbServer = "https://hotels.cloudbeds.com/api/v1.2/";
// const cbApiCall = 'getGuestList'
// const cbApiCall = "getHouseAccountDetails?";
const cbApiHouseAccountList = "getHouseAccountList?";
const cbApiGetReservations = "getReservations?";
// const cbApiCall = 'getDashboard'

const cbOptions = {
    method: "GET",
    headers: {
        "x-api-key": "cbat_AVYJ4dezriaScXdXY9WJrVyjHl5PxxY5",
    },
};

function getHAList() {
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
    });
    fetch(cbServer + cbApiHouseAccountList + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            console.log("main: getHAList: ", data);
            ha_accts = data.data;
            // window.webContents.send("haList", data);
        });
}   

ipcMain.on("haList", async (event, data) => {
    // getHAList();
    console.log('main: haList: ', ha_accts)
    window.webContents.send("haList", ha_accts);
});





function getResList() {
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        checkInFrom: "2024-08-23",
        checkInTo: "2024-08-31",
    });
    fetch(cbServer + cbApiGetReservations + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            console.log("main: getResList: ", data);
            resData = data.data;
            // window.webContents.send("haList", data);
        });
}   
ipcMain.on("resLiist", async (event, data) => {
    // getHAList();
    console.log('main: resLiist: ', resData)
    window.webContents.send("resData", resData);
});


/*
ipcMain.on("haList", async (event, data) => {
    let params = new URLSearchParams({
        propertyID: "310046",
    });
    fetch(cbServer + cbApiCall + params, cbOptionsHA)
        .then(res => res.json())      
        .then((data) => {
            // console.log("in main: ", data);
            // ha_accts = data.data;
            window.webContents.send("haList", data);
        });
})
*/

/**
 * Sending messages to Renderer
 * `window` is an object which is an instance of `BrowserWindow`
 * `data` can be a boolean, number, string, object, or array
 */
function sendToRenderer(data) {
    window.webContents.send("custom-endpoint", data);
}

/**
 * Receiving messages from Renderer
 */
ipcMain.handle("custom-endpoint", async (event, data) => {
    console.log(data);
});

/**
 * Receiving guest search string from Renderer
 */
ipcMain.on("gstSearch", async (event, data) => {
    // console.log( data )
    let qryStr = findGst.findGst.replace("QQQ", data);
    // qryStr
    // console.log('in Search: ', data , qryStr  )
    // db.all("SELECT * FROM vipfile WHERE lastname LIKE '%" + data + "%'",
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            window.webContents.send("gstSearch", rows);
        }
    });
});

/**
 * Receiving guest number from Renderer
 */

ipcMain.on("gstDetail", async (event, data) => {
    // console.log( data )
    let qryStr = findGst.getGstDtl.replace("QQQ", data);
    // console.log('in Detail: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('rows: ', rows);
            window.webContents.send("gstDetail", rows);
        }
    });
});

ipcMain.on("gstReserves", async (event, data) => {
    // console.log('main: gstReserves: ',  data )
    let qryStr = findGst.getReserves.replace("QQQ", data);
    // console.log('in Reserve: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('main: gstReserves: rows: ', rows);
            window.webContents.send("gstReserve", rows);
        }
    });
});

ipcMain.on("mGstResDetail", async (event, data) => {
    // console.log('main: gstResDetail: ', data )
    let qryStr = findGst.getReservations.replace("QQQ", data);
    // console.log('mGstResDetail: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('main: mGstResDetail: rows: ', rows);
            window.webContents.send("gstResDetail", rows);
        }
    });
});

ipcMain.on("gstStays", async (event, data) => {
    // console.log('main: gstStays: ',  data )
    let qryStr = findGst.getStayHist.replace("QQQ", data);
    // console.log('in Reserve: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('main: gstStays: rows: ', rows);
            window.webContents.send("gstStays", rows);
        }
    });
});

ipcMain.on("gstStayDetail", async (event, data) => {
    // console.log('main: gstStayDetail: ', data )

    let tranRows = [];
    let notes = "";

    // get the transactions
    let qryStr = findGst.getStayHistDtl.replace("QQQ", data);

    // console.log('main: gstStayDetail: ', data , qryStr  )
    let rows;
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('main: gstStayDetail: rows: ', rows);
            tranRows = rows;

            // now get the notes
            let qryStr2 = findGst.getStayDtlNotes.replace("QQQ", data);

            db.all(qryStr2, function (err, noteRows) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('main: gstStayDetail: noteRows: ', noteRows);
                    notes = noteRows[0].NOTES;
                    rows.push({ NOTES: notes });
                    window.webContents.send("gstStayDetail", rows);
                    // window.webContents.send('gstStayDetail', rows);
                }
            });
        }
    });
});

/**
 * Receiving ha search string from Renderer
 */
ipcMain.on("haSearchxx", async (event, data) => {
    // console.log( data )
    let qryStr = findHA.findHA.replace("QQQ", data);
    // qryStr
    // console.log("in HA Search: ", data, qryStr);

    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log("in HA Search: ", rows);
            windowHA.webContents.send("haSearch", rows);
        }
    });
});

ipcMain.on("haDetail", async (event, data) => {
    // console.log( data )
    let qryStr = findHA.getHaDtl.replace("QQQ", data);
    // console.log('in Detail: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('rows: ', rows);
            windowHA.webContents.send("haDetail", rows);
        }
    });
});

ipcMain.on("haTrans", async (event, data) => {
    // console.log( data )
    let qryStr = findHA.getYearMonths.replace("QQQ", data);
    // console.log('in haTrans: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('rows: ', rows);
            windowHA.webContents.send("haTrans", rows);
        }
    });
});

ipcMain.on("dispHaTranDtl", async (event, data) => {
    // console.log( 'key: ' , data.key )
    // console.log( 'dt: ' , data.dt )

    let qryStr = findHA.getYrMoTrans.replace("QQQ", data.key);
    qryStr = qryStr.replace("DDD", data.dt);
    // console.log('in haTrans: ', data , qryStr  )
    db.all(qryStr, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            // console.log('rows: ', rows);
            windowHA.webContents.send("haTransDtl", rows);
        }
    });
});
