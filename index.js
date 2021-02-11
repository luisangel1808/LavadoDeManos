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


const getAllRegisters = () =>{
    registerListRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        console.log(Object.keys(data));
        getValues(data);
    });
}
const tbody = document.getElementById('tbody')
const getValues = (obj)=>{
    while(tbody.lastChild){
        tbody.removeChild(tbody.lastChild);
    }
    let registersArray = []
    Object.keys(obj).forEach((key)=> {
        registersArray.push(obj[key]);
    });
    registersArray.map((item)=>{
        const tr = document.createElement('tr');
        const tdUser = document.createElement('td');
        const tdDate = document.createElement('td');
        const tdGel = document.createElement('td');
        const tdSoap = document.createElement('td');
        const tdObservations = document.createElement('td');
        tdUser.innerText = item.user;
        const date = new Date(item.date);
        const completedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        tdDate.innerText = completedDate;
        let soapText;
        let gelText;
        item.soap ? soapText= "Sí" : soapText="No";
        item.gel ? gelText= "Sí" : gelText="No";
        tdSoap.innerText = soapText;
        tdGel.innerText = gelText;
        tdObservations.innerText = item.observations;
        tr.appendChild(tdDate);
        tr.appendChild(tdUser);
        tr.appendChild(tdGel);
        tr.appendChild(tdSoap);
        tr.appendChild(tdObservations);
        tbody.appendChild(tr)
    })
}


getAllRegisters();