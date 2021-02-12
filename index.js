// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZ99yHUmihRuS69XBgga3O-7LF7RXNbIA",
    authDomain: "lavado-de-manos-300b8.firebaseapp.com",
    databaseURL: "https://lavado-de-manos-300b8-default-rtdb.firebaseio.com",
    projectId: "lavado-de-manos-300b8",
    storageBucket: "lavado-de-manos-300b8.appspot.com",
    messagingSenderId: "509736037072",
    appId: "1:509736037072:web:a061ec5dfd60d45a790cd5"
};
// Initialize Firebase with a "default" Firebase project
firebase.initializeApp(firebaseConfig);
// Initialize Firebase with a "default" Firebase project

const otherHour = document.getElementById('other');
const nowHour = document.getElementById('now');
const manualHour = document.getElementById('hour-manual');
const myDate = document.getElementById('myDate');
const myHour = document.getElementById('myHour');

    otherHour.addEventListener("click", ()=>{
      manualHour.classList.remove('hidde');
      manualHour.classList.add('hour-manual');
    })
    nowHour.addEventListener("click", ()=>{
      manualHour.classList.add('hidde');
      manualHour.classList.remove('hour-manual');
    })

const registerListRef = firebase.database().ref('pregistros');
const newRegister = () =>{
    const user = document.getElementById('name').value;
    const soap = document.getElementById('soap').checked;
    const gel = document.getElementById('gel').checked;
    const observations = document.getElementById('observations').value;
    let date;
    (nowHour.checked) 
    ? date= Date.now() 
    :  date = Date.parse(new Date(`${myDate.value}T${myHour.value}:00`));
    
    const newRegisterRef = registerListRef.push();
    newRegisterRef.set({
        user,
        date,
        soap,
        gel,
        observations
    }, (error) => {
        if (error) {
            console.log('Un error ocurrió')
        } else {
            console.log('Registro guardado')
        }
      })
}

const getAllRegisters = (initDate, finalDate) =>{
    console.log(initDate)
    registerListRef.orderByChild('date').startAt(initDate).endAt(finalDate).on('value', (snapshot) => {
        const data = snapshot.val();
        getValues(data);
    });
}
const tbody = document.getElementById('tbody');
const sectionRegisters = document.getElementById('registers');
const downloadButton = document.createElement('button');
downloadButton.type='button';
downloadButton.innerText='Descargar datos';
sectionRegisters.appendChild(downloadButton);
const getValues = (obj)=>{
    if(!obj){
        alert('No existen registros en este rango')
        return false
    }
    while(tbody.lastChild){
        tbody.removeChild(tbody.lastChild);
    }
    let registersArray = []
    let keys = []
    console.log(obj)
    Object.keys(obj).forEach((key)=> {
        keys.push(key);
        registersArray.push(obj[key]);
    });

    registersArray.sort(function(a, b) {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        return 0;
    });

    registersArray.map((item, index)=>{
        const tr = document.createElement('tr');
        const td = [];
        for(let i = 0; i<6; i++){
            td[i] = document.createElement('td');
            tr.appendChild(td[i]);
        }
        td[0].innerText = item.user;
        const date = new Date(item.date);
        let minutes = date.getMinutes();
        if(minutes<10) minutes = `0${minutes}`;
        let hours = date.getHours();
        if(hours<10) hours = `0${hours}`;
        const completedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`
        item.date=completedDate;
        td[1].innerText = completedDate;
        item.soap ? item.soap= "Sí" : item.soap="No";
        item.gel ? item.gel= "Sí" : item.gel="No";
        td[2].innerText = item.soap;
        td[3].innerText = item.gel;
        td[4].innerText = item.observations;
        const editButton = document.createElement('button');
        editButton.type='button';
        editButton.innerText='Editar';
        editButton.classList.add('update');
        //td[5].appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.type='button';
        deleteButton.innerText='Borrar';
        deleteButton.classList.add('delete');
        deleteButton.onclick = ()=>{
            removeRegister(keys[index])
        }
        td[5].appendChild(deleteButton);
        tbody.appendChild(tr);
    })

    downloadButton.onclick= ()=>{
        console.log(registersArray);
        exportData(registersArray);
    }
    
}

const exportData =(data) =>{
    filename='Reporte.xlsx';
     var ws = XLSX.utils.json_to_sheet(data);
     var wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Registers");
     XLSX.writeFile(wb,filename);
}

const removeRegister = (key) =>{
    const adaRef = firebase.database().ref(`pregistros/${key}`);
    adaRef.remove()
      .then(function() {
        console.log("Remove succeeded.")
    })
    .catch(function(error) {
        console.log("Remove failed: " + error.message)
    });
}

const consultButton = document.getElementById('consult');
const fromDate = document.getElementById('fromDate');
const untilDate = document.getElementById('untilDate');
consultButton.onclick=()=>{
    let initDate= 0;
    let finalDate=Date.now();
    if(fromDate.value){
        initDate = Date.parse(new Date(`${fromDate.value}T00:00:00`));
    } 
    if(untilDate.value){
        finalDate = Date.parse(new Date(`${untilDate.value}T23:59:59`));
    }
    getAllRegisters(initDate, finalDate);
}