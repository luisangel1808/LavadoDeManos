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
const usersListRef = firebase.database().ref('empleado');
const getUsers = () =>{
    usersListRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if(data===null){
            while(list.lastChild){
                list.removeChild(list.lastChild);
            }
            return false;
        }
        const names = Object.values(data);
        const keys = Object.keys(data);

        showNames(names, keys);
    });
}

const showNames = (names, keys) => {
    const list = document.getElementById("list");
    while(list.lastChild){
        list.removeChild(list.lastChild);
    }
    for(let i = 0; i<names.length; i++){
        const li = document.createElement("li");
        li.innerText = names[i];
        const buttonDelete = document.createElement('button');
        buttonDelete.type='button';
        buttonDelete.innerText='Eliminar';
        buttonDelete.onclick = () =>{
            const adaRef = firebase.database().ref(`empleado/${keys[i]}`);
            if (window.confirm(`¿Realmente quieres borrar a ${names[i]} ?`)) {
                adaRef.remove()
                .then(()=> {
                  getUsers();
                  alert("Usuario eliminado.");
              })
              .catch(error=> {
                  alert("No se pudo eliminar: " + error.message);
              });
              }
        }
        buttonDelete.classList.add('list__delete')
        list.appendChild(li);
        li.appendChild(buttonDelete);
    }

}
getUsers();

const newRegister = () =>{
    const user = document.getElementById('name').value;
    const newRegisterRef = usersListRef.push();
    newRegisterRef.set(
        user
    , (error) => {
        if (error) {
            alert('Un error ocurrió');
        } else {
            alert('Registro guardado');
            getUsers();
        }
      })
}

