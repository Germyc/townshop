import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, push, update, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6zWOQNU7leg05U6vDvaMU2fCLW0WqwBU",
    authDomain: "imprenta-ars.firebaseapp.com",
    databaseURL: "https://imprenta-ars-default-rtdb.firebaseio.com",
    projectId: "imprenta-ars",
    storageBucket: "imprenta-ars.firebasestorage.app",
    messagingSenderId: "269247827079",
    appId: "1:269247827079:web:c86f34edc5a0cfd8f1fc22",
    measurementId: "G-NMTEE18PY7"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Este es el cliente que estamos administrando
const idCliente = "panaderia-el-sol"; 

// --- 1. AUTENTICACIÓN ---

// Escuchar si el usuario entra o sale
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Logueado: Mostrar panel, ocultar login
        document.getElementById('pantalla-login').style.display = 'none';
        document.getElementById('pantalla-dashboard').style.display = 'block';
        cargarProductos();
    } else {
        // No logueado
        document.getElementById('pantalla-login').style.display = 'block';
        document.getElementById('pantalla-dashboard').style.display = 'none';
    }
});

// Botón Ingresar
document.getElementById('btn-login').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    signInWithEmailAndPassword(auth, email, pass)
        .catch((error) => {
            document.getElementById('login-error').style.display = 'block';
            console.error(error.message);
        });
});

// Botón Cerrar Sesión
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth);
});

// --- 2. BASE DE DATOS (CRUD) ---

const productosRef = ref(db, `clientes/${idCliente}/productos`);

// Leer y listar productos
function cargarProductos() {
    onValue(productosRef, (snapshot) => {
        const contenedor = document.getElementById('lista-productos');
        contenedor.innerHTML = '';
        const data = snapshot.val();
        
        if (!data) {
            contenedor.innerHTML = '<p>No tienes productos registrados.</p>';
            return;
        }

        Object.keys(data).forEach(key => {
            const p = data[key];
            const div = document.createElement('div');
            div.className = 'producto-admin';
            div.innerHTML = `
                <div>
                    <strong>${p.nombre}</strong> <br> <span style="color:green;">$${p.precio}</span>
                </div>
                <div>
                    <button class="btn-edit" onclick="editar('${key}', '${p.nombre}', '${p.precio}', '${p.categoria}', '${p.descripcion}', '${p.imagen}')">Editar</button>
                    <button class="btn-danger" onclick="borrar('${key}')">Borrar</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }, (error) => {
        console.error(error);
        alert("No tienes permisos. Verifica el UID en Firebase.");
    });
}

// Guardar (Nuevo o Edición)
document.getElementById('btn-guardar').addEventListener('click', () => {
    const id = document.getElementById('prod-id').value;
    const nombre = document.getElementById('prod-nombre').value;
    const precio = document.getElementById('prod-precio').value;
    const categoria = document.getElementById('prod-categoria').value;
    const desc = document.getElementById('prod-desc').value;
    const img = document.getElementById('prod-img').value || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"; // Imagen por defecto

    if(!nombre || !precio) return alert("Nombre y precio son obligatorios");

    const productoData = { nombre, precio: Number(precio), categoria, descripcion: desc, imagen: img };

    if (id) {
        // Editar existente
        update(ref(db, `clientes/${idCliente}/productos/${id}`), productoData)
            .then(() => limpiarFormulario());
    } else {
        // Crear nuevo
        push(productosRef, productoData)
            .then(() => limpiarFormulario());
    }
});

// Funciones globales para botones dinámicos (Editar/Borrar)
window.borrar = function(id) {
    if(confirm("¿Seguro que quieres borrar este producto?")) {
        remove(ref(db, `clientes/${idCliente}/productos/${id}`));
    }
}

window.editar = function(id, nombre, precio, categoria, desc, img) {
    document.getElementById('form-titulo').innerText = "Editar Producto";
    document.getElementById('prod-id').value = id;
    document.getElementById('prod-nombre').value = nombre;
    document.getElementById('prod-precio').value = precio;
    document.getElementById('prod-categoria').value = categoria;
    document.getElementById('prod-desc').value = desc;
    document.getElementById('prod-img').value = img;
    window.scrollTo(0, 0);
}

function limpiarFormulario() {
    document.getElementById('form-titulo').innerText = "Agregar Nuevo Producto";
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-precio').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-img').value = '';
}