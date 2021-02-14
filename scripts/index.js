const firebaseConfig = {
    apiKey: "AIzaSyBZ99yHUmihRuS69XBgga3O-7LF7RXNbIA",
    authDomain: "lavado-de-manos-300b8.firebaseapp.com",
    databaseURL: "https://lavado-de-manos-300b8-default-rtdb.firebaseio.com",
    projectId: "lavado-de-manos-300b8",
    storageBucket: "lavado-de-manos-300b8.appspot.com",
    messagingSenderId: "509736037072",
    appId: "1:509736037072:web:a061ec5dfd60d45a790cd5"
};

firebase.initializeApp(firebaseConfig);
// DOM Reference
const otherHour = document.getElementById('other');
const nowHour = document.getElementById('now');
const manualHour = document.getElementById('hour-manual');
const myDate = document.getElementById('myDate');
const myHour = document.getElementById('myHour');
const consultButton = document.getElementById('consult');
const fromDate = document.getElementById('fromDate');
const untilDate = document.getElementById('untilDate');
const tbody = document.getElementById('tbody');
const buttonsDiv = document.querySelector('.buttons');
const sectionRegisters = document.getElementById('registers');
const downloadButton = document.createElement('button');
downloadButton.type='button';
downloadButton.innerText='Descargar datos';
sectionRegisters.appendChild(downloadButton);

otherHour.addEventListener("click", ()=>{
    manualHour.classList.remove('hidde');
    manualHour.classList.add('hour-manual');
})
nowHour.addEventListener("click", ()=>{
    manualHour.classList.add('hidde');
    manualHour.classList.remove('hour-manual');
})

const registerListRef = firebase.database().ref('pregistros');
//Add new Register on the db
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
            alert('Un error ocurrió');
        } else {
            alert('Registro guardado');
            getAllRegisters(0,Date.now())
        }
      })
}
//Get all registers in a determinated date range, in call getValues with this object
const getAllRegisters = (initDate, finalDate) =>{
    registerListRef.orderByChild('date').startAt(initDate).endAt(finalDate).on('value', (snapshot) => {
        const data = snapshot.val();
        getValues(data);
    });
}

const getValues = (obj)=>{
    if(!obj){
        alert('No existen registros en este rango');
        while(tbody.lastChild){
            tbody.removeChild(tbody.lastChild);
        }
        return false;
    }

    let registersArray = [];
    let keys = [];
    Object.keys(obj).forEach((key)=> {
        keys.push(key);
        registersArray.push(obj[key]);
    });
    registersArray.reverse();

    let ArrayDivision = [];
    let subdivision = [];
    let position = 0;
    registersArray.map((item, index)=>{
        subdivision.push(item);
        if(index+1>1 && (index+1)%5==0){
            ArrayDivision.push(subdivision);
            subdivision = [];
        }
        if(index===registersArray.length-1 && subdivision.length>0){
            ArrayDivision.push(subdivision);
        }
    })

    const showFiveregisters = position =>{
        while(tbody.lastChild){
            tbody.removeChild(tbody.lastChild);
        }
        ArrayDivision[position].map((item, index)=>{
        const tr = document.createElement('tr');
        const td = [];
        for(let i = 0; i<6; i++){
            td[i] = document.createElement('td');
            tr.appendChild(td[i]);
        }
        td[1].innerText = item.user;
        const date = new Date(item.date);
        let minutes = date.getMinutes();
        if(minutes<10) minutes = `0${minutes}`;
        let hours = date.getHours();
        if(hours<10) hours = `0${hours}`;
        const completedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${hours}:${minutes}`;
        item.date=completedDate;
        td[0].innerText = completedDate;
        item.soap===true ? item.soap= "Sí" : item.soap="No";
        item.gel===true ? item.gel= "Sí" : item.gel="No";
        td[2].innerText = item.soap;
        td[3].innerText = item.gel;
        td[4].innerText = item.observations;

        const deleteButton = document.createElement('button');
        deleteButton.type='button';
        deleteButton.innerText="Eliminar";
        deleteButton.classList.add('delete');
        deleteButton.onclick = ()=>{
            removeRegister(keys[(registersArray.length-1)-((index)+(position*5))]);
        }
        td[5].appendChild(deleteButton);
            tbody.appendChild(tr);
        })
        if(ArrayDivision.length>1){
            const quantity = document.querySelector('.quantity');

        while(buttonsDiv.lastChild){
            buttonsDiv.removeChild(buttonsDiv.lastChild);
            quantity.innerText=""
        }
        quantity.innerText=`Página ${position+1} de ${ArrayDivision.length} - ${registersArray.length} registros encontrados`;
        const lastButton = document.createElement('button');
        lastButton.type='button';
        lastButton.innerText='Último';
        const firstButton = document.createElement('button');
        firstButton.type='button';
        firstButton.innerText='Primero';
        const nextButton = document.createElement('button');
        nextButton.type='button';
        nextButton.innerText='Siguiente';
        const prevButton = document.createElement('button');
        prevButton.type='button';
        prevButton.innerText='Anterior';
        prevButton.onclick = () =>{
            if(position>0){
                position--;
                showFiveregisters(position);
            }
        }
        nextButton.onclick = () =>{
            if(position<ArrayDivision.length-1){
                position++;
                showFiveregisters(position);
            }
        }
        firstButton.onclick = () =>{
            position=0;
            showFiveregisters(position);
        }
        lastButton.onclick = () =>{
            position=(ArrayDivision.length-1);
            showFiveregisters(position);
        }
        buttonsDiv.appendChild(firstButton);
        buttonsDiv.appendChild(prevButton);
        buttonsDiv.appendChild(nextButton);
        buttonsDiv.appendChild(lastButton);
    }
}
    showFiveregisters(position);

    downloadButton.onclick= ()=>{
        exportData(registersArray);
    }
    const registersTable = document.getElementById('registers__table');
    registersTable.classList.remove('hidde');
}

const exportData = data =>{
    filename='Reporte.xlsx';
     var ws = XLSX.utils.json_to_sheet(data);
     var wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Registers");
     XLSX.writeFile(wb,filename);
}

const removeRegister = key =>{
    const adaRef = firebase.database().ref(`pregistros/${key}`);
    adaRef.remove()
      .then(()=> {
        getAllRegisters(0, Date.now());
        alert("Registro eliminado.");
    })
    .catch(error=> {
        alert("No se pudo eliminar: " + error.message);
    });
}


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

const getUsers = () =>{
    const usersListRef = firebase.database().ref('empleado');
    usersListRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const names = Object.values(data);
        addOptions(names);
    });
}
getUsers();

const addOptions = names => {
    const select = document.getElementById('name');
    for (value in names) {
     const option = document.createElement("option");
     option.text = names[value];
     select.add(option);
    }
}