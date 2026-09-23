console.log("El script de Firebase está arrancando correctamente");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

let productosGlobales = [];
let carrito = [];
const numeroComercio = "5491123456789"; 

// 1. Escuchar la base de datos en tiempo real
const idCliente = "panaderia-el-sol"; 
const productosRef = ref(db, `clientes/${idCliente}/productos`);

onValue(productosRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        productosGlobales = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
        renderizarProductos(productosGlobales);
    } else {
        document.getElementById('catalogo-productos').innerHTML = '<p style="text-align:center; width:100%;">No hay productos cargados.</p>';
    }
}, (error) => {
    console.error("Error de Firebase:", error);
    document.getElementById('catalogo-productos').innerHTML = '<p style="color:red; text-align:center; width:100%;">Error de permisos al conectar.</p>';
});
onValue(productosRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        productosGlobales = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
        renderizarProductos(productosGlobales);
    } else {
        document.getElementById('catalogo-productos').innerHTML = '<p style="text-align:center; width:100%;">No hay productos cargados.</p>';
    }
});

// 2. Pintar las tarjetas de productos
function renderizarProductos(productos) {
    const contenedor = document.getElementById('catalogo-productos');
    contenedor.innerHTML = ''; 

    productos.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'producto-card';
        div.dataset.categoria = prod.categoria;
        
        div.innerHTML = `
            <img src="${prod.imagen}" class="producto-img" alt="${prod.nombre}">
            <div class="producto-info">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <div class="precio-row">
                    <span class="precio">$${prod.precio}</span>
                    <button class="btn-add" data-id="${prod.id}">+ Agregar</button>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });

    // Asignar eventos de click dinámicos
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const producto = productosGlobales.find(p => p.id === id);
            
            carrito.push(producto);
            actualizarCarritoUI();

            e.target.innerText = "¡Agregado!";
            e.target.style.background = "#10b981";
            e.target.style.color = "white";
            setTimeout(() => {
                e.target.innerText = "+ Agregar";
                e.target.style.background = "#f1f5f9";
                e.target.style.color = "#1e293b";
            }, 800);
        });
    });
}

// 3. Manejo del Carrito
window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    document.getElementById('cart-count').innerText = carrito.length;
    const contenedor = document.getElementById('cart-items-container');
    
    if(carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:gray; padding-top:20px;">Tu pedido está vacío.</p>';
        document.getElementById('cart-total').innerText = `$0`;
        return;
    }

    contenedor.innerHTML = '';
    let total = 0;
    
    carrito.forEach((item, index) => {
        total += Number(item.precio);
        contenedor.innerHTML += `
            <div class="cart-item">
                <span style="font-size:14px;">${item.nombre}</span>
                <div>
                    <strong>$${item.precio}</strong>
                    <button onclick="eliminarDelCarrito(${index})" style="border:none; background:none; cursor:pointer; color:red; margin-left:10px;">❌</button>
                </div>
            </div>
        `;
    });

    document.getElementById('cart-total').innerText = `$${total}`;
}

// 4. Formatear y enviar mensaje a WhatsApp
document.getElementById('btn-enviar-wsp').addEventListener('click', () => {
    if(carrito.length === 0) {
        alert("Agrega productos antes de enviar el pedido.");
        return;
    }

    const tipoEntrega = document.querySelector('input[name="entrega"]:checked').value;
    const textoEntrega = tipoEntrega === 'envio' ? '🛵 *Envío a domicilio*' : '🏪 *Retiro en el local*';

    let mensaje = `Hola! Quiero hacer el siguiente pedido:\n\n`;
    carrito.forEach(item => { mensaje += `- ${item.nombre} ($${item.precio})\n`; });
    
    const total = carrito.reduce((sum, item) => sum + Number(item.precio), 0);
    mensaje += `\n*Total: $${total}*\nModalidad: ${textoEntrega}\n\nQuedo a la espera para coordinar. Gracias!`;

    window.open(`https://wa.me/${numeroComercio}?text=${encodeURIComponent(mensaje)}`, '_blank');
});

// 5. Controles de Interfaz (Modal y Filtros)
const toggleModal = () => {
    document.getElementById('cart-modal').classList.toggle('abierto');
    document.getElementById('overlay').classList.toggle('activo');
};
document.getElementById('btn-abrir-carrito').addEventListener('click', toggleModal);
document.getElementById('btn-cerrar-carrito').addEventListener('click', toggleModal);
document.getElementById('overlay').addEventListener('click', toggleModal);

document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        
        const categoria = e.target.getAttribute('data-cat');
        document.querySelectorAll('.producto-card').forEach(card => {
            card.style.display = (categoria === 'todos' || card.dataset.categoria === categoria) ? 'block' : 'none';
        });
    });
});