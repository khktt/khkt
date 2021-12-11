// Modules to control application life and create native browser window
const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const luxon = require("luxon");
const email = require("gmail-send");
let fs = require("fs");
var ipc = electron.ipcMain;
var sis = require("systeminformation");

let clddt = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "calender_data.json")))

let config = JSON.parse(fs.readFileSync(path.join(__dirname, "config", "config.json")))

var emailU = "manalearn530@gmail.com";
var pass = "aptx3561"

const sendP = email({
  user: emailU,
  pass: pass,
  to:   config.parent,
  subject: 'KHKT',
});

const sendT = email({
  user: emailU,
  pass: pass,
  to:   config.teacher,
  subject: 'KHKT',
});

/*(async ()=>{
  var array = await getProcess();
      var aString = "";
      for (var i in array) aString += `${Number(i)+1}. ${array[i]}\n`;
      var sendCT = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã vào lớp đúng giờ!\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Danh sách ứng dụng đang chạy:\n`;
      sendCT += aString;
      sendP({
        text: sendCT,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(parent)");
      })s
})()*/

var dateNow = luxon.DateTime.now().setZone("Asia/Ho_Chi_Minh");
//dateNow = dateNow.set({hour: 7, minute: 0});

var dayOfWeek = dateNow.weekday;

console.log(dateNow.hour);

if (config.dowStudy.indexOf(dayOfWeek) != -1){
  var timeStart = config.timeStart[config.dowStudy.indexOf(dayOfWeek)];
  var hourStart = Number((timeStart.split(":"))[0]);
  var minStart = Number((timeStart.split(":"))[1]);

  var timeEnd = config.timeEnd[config.dowStudy.indexOf(dayOfWeek)];
  var hourEnd = Number((timeEnd.split(":"))[0]);
  var minEnd = Number((timeEnd.split(":"))[1]);

  var dateNowJS = new Date(dateNow.ts);
  dateNowJS.setHours(hourStart);
  dateNowJS.setMinutes(minStart);
  let timeStartJS = dateNowJS.getTime();
  global.timeStartJS = dateNowJS.getTime();

  var dateEndJS = new Date(dateNow.ts);
  dateEndJS.setHours(hourEnd);
  dateEndJS.setMinutes(minEnd);
  let timeEndJS = dateEndJS.getTime();
  global.timeEndJS = dateEndJS.getTime();

  if (dateNow.ts<=timeStartJS){
    console.log(dateNow.minute);
    
    setTimeout(async function () {
      var array = await getProcess();
      var aString = "";
      var ok = false;
      for (var i in array) aString += `${Number(i)+1}. ${array[i]}\n`;
      for (var i of config.studyProgram)
        if(array.indexOf(i.toLowerCase()) != -1) ok = true;
      if(ok) var sendCT = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã vào lớp đúng giờ!\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Danh sách ứng dụng đang chạy:\n`
      else {
        var sendCT = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này chưa khởi động ứng dụng học tập\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Danh sách ứng dụng đang chạy:\n`
        var checkAppStudy = setInterval(async function () {
          var listA = await getProcess();
          
          var ok = false;
          for (var i of config.studyProgram)
            if(listA.indexOf(i.toLowerCase()) != -1) ok = true;
          console.log(ok)
          if (ok){
            var strDelay="";
            if(Number(dateNow.hour) - hourStart > 0) {
              strDelay += `${Number(dateNow.hour) - hourStart} giờ `
              if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`
              else strDelay += `${minStart -Number(dateNow.minute)} phút`;
            }else if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`;

            var sendC = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã khởi động ứng dụng học tập trễ ${strDelay}`
            sendP({
              text: sendC,  
            }, (error, result, fullResult) => {
              if (error) console.error(error);
              console.log(result+"(parent)");
            })

            sendT({
              text: sendC,  
            }, (error, result, fullResult) => {
              if (error) console.error(error);
              console.log(result+"(teacher)");
            })
            clearInterval(checkAppStudy);
          }
        },5000)
      };
      sendCT += aString;
      sendP({
        text: sendCT,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(parent)");
      })

      sendT({
        text: sendCT,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(teacher)");
      })

    }, dateNow.ts - dateNowJS.getTime())
  } else if (dateNow.ts>timeStartJS && dateNow.ts<timeEndJS){
    (async () =>{
      console.log(dateNow.hour)
      var dateNowJS = new Date(dateNow.ts);
      dateNowJS.setHours(hourStart);
      dateNowJS.setMinutes(minStart);
      var array = await getProcess();
      var aString = "";
      var ok = false;
      for (var i in array) aString += `${Number(i)+1}. ${array[i]}\n`;
      for (var i of config.studyProgram)
        if(array.indexOf(i.toLowerCase()) != -1) ok = true;
      var strDelay="";
      if(Number(dateNow.hour) - hourStart > 0) {
        strDelay += `${Number(dateNow.hour) - hourStart} giờ `
        if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`
        else strDelay += `${minStart -Number(dateNow.minute)} phút`;
      }else if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`;
      if(ok) var sendCT = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã vào lớp trễ ${strDelay}!\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Danh sách ứng dụng đang chạy:\n`
      else {
        var sendCT = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này chưa khởi động ứng dụng học tập\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Danh sách ứng dụng đang chạy:\n`
        var checkAppStudy = setInterval(async function () {
          var listA = await getProcess();
          
          var ok = false;
          for (var i of config.studyProgram)
            if(listA.indexOf(i.toLowerCase()) != -1) ok = true;
          console.log(ok)
          if (ok){
            var strDelay="";
            if(Number(dateNow.hour) - hourStart > 0) {
              strDelay += `${Number(dateNow.hour) - hourStart} giờ `
              if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`
              else strDelay += `${minStart -Number(dateNow.minute)} phút`;
            }else if(Number(dateNow.minute) - minStart > 0) strDelay += `${Number(dateNow.minute) - minStart} phút`;

            var sendC = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã khởi động ứng dụng học tập trễ ${strDelay}`
            sendP({
              text: sendC,  
            }, (error, result, fullResult) => {
              if (error) console.error(error);
              console.log(result+"(parent)");
            })

            sendT({
              text: sendC,  
            }, (error, result, fullResult) => {
              if (error) console.error(error);
              console.log(result+"(teacher)");
            })
            clearInterval(checkAppStudy);
          }
        },5000)
      };
      sendCT += aString;

      sendP({
        text: sendCT,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(parent)");
      })

      sendT({
        text: sendCT,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(teacher)");
      })
    })();
  }
}
 
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1195,
    height: 720,
    minWidth: 1195,
    minHeight: 720,
    icon: "./icon/icon_app.jpg",
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  ipc.on("calender.data.send", (event, data)=>{
	  mainWindow.webContents.send("calender.data", clddt)
  })

  ipc.on("sendEmail", (event, data)=>{
    sendEmaill(data);
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async function () {
  var sendC = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã đóng ứng dụng quản lý vào lúc ${dateNow.hour} giờ ${dateNow.minute} phút.`;
  var dateNowJS = new Date(dateNow.ts);
  dateNowJS.setHours(hourStart);
  dateNowJS.setMinutes(minStart);
  let timeStartJS = dateNowJS.getTime();

  var dateEndJS = new Date(dateNow.ts);
  dateEndJS.setHours(hourEnd);
  dateEndJS.setMinutes(minEnd);
  let timeEndJS = dateEndJS.getTime();

  if (dateNow.ts>=timeStartJS && dateNow.ts<=timeEndJS){
    console.log("close");

  await sendP({
    text: sendC,  
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result+"(parent)");
  })

  await sendT({
    text: sendC,  
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result+"(teacher)");
  })}

  await new Promise(x=>setTimeout(x, 5000));
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


async function getProcess() {
  var list = (await sis.processes()).list;

  var run = [];
  for(var i of list){
    if(run.indexOf(i.name)==-1){
      if(i.path != "" && i.path.toLowerCase().indexOf("system32") == -1&&i.name!=""){
        run.push(i.name.toLowerCase());      
      }
    }
  }
  return run;
}

let listAppRunning;

(async ()=>{listAppRunning = await getProcess()})();

setInterval(async function () {
  var list = await getProcess();

  console.log("checking...")

  if (list.length > listAppRunning.length){
    console.log("appS");
    var listStart = '';
    var z=0;
    for(var i of list){
      if (listAppRunning.indexOf(i) == -1){
        z++;
        listStart += `${z}. ${i}\n`;
      }
    }

    var sendC = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã khởi động 1(vài) ứng dụng vào lúc ${dateNow.hour} giờ ${dateNow.minute} phút. Danh sách:\n`+listStart;
    if (dateNow.ts>=global.timeStartJS && dateNow.ts<=global.timeEndJS){
      sendP({
        text: sendC,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(parent)");
      })

      sendT({
        text: sendC,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(teacher)");
      });
    }
    listAppRunning = list;
  }
  if (list.length < listAppRunning.length){
    console.log("appC")
    var listStop = '';
    var z=0;
    for(var i of listAppRunning){
      if (list.indexOf(i) == -1){
        z++;
        listStop += `${z}. ${i}\n`;
      }
    }

    var sendC = `-Học sinh: ${config.name}\n-Lớp: ${config.className}\n-Trường: ${config.school}\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n Học sinh này đã đóng 1(vài) ứng dụng vào lúc ${dateNow.hour} giờ ${dateNow.minute} phút. Danh sách:\n`+listStop;

    if (dateNow.ts>=global.timeStartJS && dateNow.ts<=global.timeEndJS){
      sendP({
        text: sendC,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(parent)");
      })

      sendT({
        text: sendC,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result+"(teacher)");
      })
    }

    listAppRunning = list;
  }
},5000)

function sendEmaill(data) {
  sendP({
    text: data,  
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result+"(parent)");
  })

  sendT({
    text: data,  
  }, (error, result, fullResult) => {
    if (error) console.error(error);
    console.log(result+"(teacher)");
  });
}