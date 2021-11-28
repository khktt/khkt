let fs = require("fs");
let path = require("path");
let electron = require("electron");
var ipc = electron.ipcRenderer;

var sis = require("systeminformation")


const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
  if(!menuOpen) {
    menuBtn.classList.add('open');
    menu.classList.add('active');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menu.classList.remove('active');
    menuOpen = false;
  }
});

let dOwFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let dataCLD;
//JSON.parse(fs.readFileSync(path.join(__dirname, "data", "calender_data.json")));
ipc.send("calender.data.send");
ipc.on("calender.data", (event, data)=>{
	dataCLD = data;
})

function changeDT(date){
  console.log(date);
}


var hidecld = new Calendar({
  id: "#calendar_hide",
  calendarSize: "small",
});

var smcld = new Calendar({
  id: "#calendar_small",
  calendarSize: "small",
  dateChanged: (_date)=>{
    try{
      //dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`] = {}
      document.querySelector(`.calendar_info .day`).innerHTML = _date.getDate();
      document.querySelector(`.calendar_info .week`).innerHTML = dOwFull[_date.getDay()];
      document.querySelector(`.calendar_info .schedule`).innerHTML = ""
      document.querySelector(`.calendar_info .free_time`).innerHTML = ""
      let json_data = {
        id: `${_date.getDate()}${_date.getMonth()}${_date.getYear()}`,
        time: _date
      }
      document.querySelector(`.calendar_info .data_day`).innerHTML = JSON.stringify(json_data);

      if(dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].schedule){
        for(var i of dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].schedule){
          document.querySelector(`.calendar_info .schedule`).innerHTML += `<li>${i}</li>`
        }
      }

      if(dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].free_time){
        for(var i of dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].free_time){
          document.querySelector(`.calendar_info .free_time`).innerHTML += `<li>${i}</li>`
        }
      }
    }catch(e){};
  }
    
});

function funcDate(_date){
    //dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`] = {}
    document.querySelector(`.calendar_info .day`).innerHTML = _date.getDate();
    document.querySelector(`.calendar_info .week`).innerHTML = dOwFull[_date.getDay()];
    document.querySelector(`.calendar_info .schedule`).innerHTML = ""
    document.querySelector(`.calendar_info .free_time`).innerHTML = ""

    let json_data = {
        id: `${_date.getDate()}${_date.getMonth()}${_date.getYear()}`,
        time: _date
      }
      document.querySelector(`.calendar_info .data_day`).innerHTML = JSON.stringify(json_data);

    if(dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`] && dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].schedule){
      for(var i of dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].schedule){
        document.querySelector(`.calendar_info .schedule`).innerHTML += `<li>${i}</li>`
      }
    }

    if(dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].free_time){
      for(var i of dataCLD[`${_date.getDate()}${_date.getMonth()}${_date.getYear()}`].free_time){
        document.querySelector(`.calendar_info .free_time`).innerHTML += `<li>${i}</li>`
      }
    }
}

//smcld.dateChanged = funcDate;

hidecld.dateChanged = funcDate;

//new Date((new Date().setDate(new Date().getUTCDate()-9)))

document.getElementById("calendar_small").style.display = "none";
document.getElementById("process-windown").style.display = "none";
document.getElementById("closePr").style.display = "none";

var cldicon = document.querySelector('.calendar_icon');

cldicon.onclick = function (){
  document.getElementById("process-windown").style = "";
  document.getElementById("calendar_small").style = "";
  document.getElementById("closePr").style = "";
}

var dsl = document.querySelector('.closePr');

dsl.onclick = function (){
  document.getElementById("calendar_small").style.display = "none";
  document.getElementById("process-windown").style.display = "none";
  document.getElementById("closePr").style.display = "none";

}

//calendar
var dOw = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

var dayow = new Date().getUTCDay() == 0? 7 : new Date().getUTCDay();

document.querySelector(`.day${dayow}`).innerHTML = `${new Date().getUTCDate()}<br>${dOw[dayow-1]}`

document.querySelector(`.day${dayow}`).onclick = function (){
    hidecld.setDate(new Date());
  }

document.querySelector(`.day${dayow}`).classList.add("today");
document.querySelector(`.day${dayow}`).classList.remove("day");

for (var i=1; i<dayow; i++){
  let di = new Date((new Date().setDate(new Date().getUTCDate()-(dayow-i))))
  document.querySelector(`.day${i}`).innerHTML = `${di.getDate()}<br>${dOw[i-1]}`
  document.querySelector(`.day${i}`).onclick = function (){
    hidecld.setDate(di.getTime());
  }
}

for (var i=dayow+1; i<=7; i++){
  let di = new Date((new Date().setDate(new Date().getUTCDate()+(i-dayow))))
  document.querySelector(`.day${i}`).innerHTML = `${di.getDate()}<br>${dOw[i-1]}`
  document.querySelector(`.day${i}`).onclick = function (){
    hidecld.setDate(di.getTime());
  }
}

//data calender

setTimeout(()=>{funcDate(new Date((new Date().setDate(new Date().getUTCDate()-0))))}, 1000);

//Input windown

document.getElementById("input_info").style.display = "none"

  //active func
function writeInput(type, info){
  document.querySelector(`.input_info textarea`).value = "";
  try{
    for(var i of dataCLD[info.id][type]){
      document.querySelector(`.input_info textarea`).value += i+"\n\n"
    }
  }catch{}
}

function activeInput(a, info){
  
  document.getElementById("process-windown").style = "";
  document.getElementById("input_info").style = "";
  writeInput(a, info);
  console.log(a)
  document.querySelector(`.input_info .data_cache`).innerHTML = JSON.stringify({
    type: a,
    info: info
  });
}

document.querySelector(`.scheduleH3`).onclick = function () {
  activeInput("schedule", JSON.parse(document.querySelector(`.calendar_info .data_day`).innerHTML))
}
document.querySelector(`.schedule`).onclick = function () {
  activeInput("schedule", JSON.parse(document.querySelector(`.calendar_info .data_day`).innerHTML))
}
document.querySelector(`.free_timeH3`).onclick = function () {
  activeInput("free_time", JSON.parse(document.querySelector(`.calendar_info .data_day`).innerHTML))
}
document.querySelector(`.free_time`).onclick = function () {
  activeInput("free_time", JSON.parse(document.querySelector(`.calendar_info .data_day`).innerHTML))
};

  //Button input
document.querySelector(`.btn_cancel`).onclick = function (){
  document.getElementById("process-windown").style.display = "none";
  document.getElementById("input_info").style.display = "none";
}


document.querySelector(`.btn_save`).onclick = function (){
  var value = document.querySelector(`.input_info textarea`).value;
  var array = value.split("\n\n");
  var cache = JSON.parse(document.querySelector(`.input_info .data_cache`).innerHTML)
  !dataCLD[cache.info.id] ? dataCLD[cache.info.id] = {
    "schedule":[],
    "free_time":[]
  }:"";
  delete dataCLD[cache.info.id][cache.type];
  dataCLD[cache.info.id][cache.type] = [];
  for(var i of array){
    dataCLD[cache.info.id][cache.type].push(i)
  }
  while(dataCLD[cache.info.id][cache.type].indexOf("") != -1){
    dataCLD[cache.info.id][cache.type].splice(dataCLD[cache.info.id][cache.type].indexOf(""), 1);
  }
  fs.writeFileSync("./data/calender_data.json", JSON.stringify(dataCLD))
  funcDate(new Date(cache.info.time));
  document.getElementById("process-windown").style.display = "none";
  document.getElementById("input_info").style.display = "none";
}

let list;

sis.processes().then(data => list=data.list);
function tet() {
  sis.processes().then(data => list=data.list);
  var run = [];
  for(var i of list){

    if(run.indexOf(i.name)==-1){
      if(i.path != "" && i.path.toLowerCase().indexOf("system32") == -1&&i.name!=""){

        run.push(i.name);      }
    }
  }
  console.log(run);
}