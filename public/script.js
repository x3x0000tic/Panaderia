document.getElementById('producto-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen_url = document.getElementById('imagen_url').value;

    const response = await fetch('/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cantidad, precio, descripcion, imagen_url })
    });

    if (response.ok) {
        alert('Producto agregado con éxito');
        loadProductos();
        document.getElementById('producto-form').reset();
    } else {
        alert('Error al agregar producto');
    }
});

async function loadProductos() {
    const response = await fetch('/productos');
    const productos = await response.json();
    const tbody = document.querySelector('#productos-table tbody');
    tbody.innerHTML = '';
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = '';

    if (productos.length === 0) {
        carousel.innerHTML = '<p>No hay imágenes disponibles.</p>';
        return;
    }

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.precio}</td>
            <td>${producto.descripcion}</td>
            <td><img src="${producto.imagen_url}" alt="${producto.nombre}" width="100" height="80"></td>
            <td>
                <button onclick="editProducto(${producto.id})">Editar</button>
                <button onclick="deleteProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);

        const img = document.createElement('img');
        img.src = producto.imagen_url;
        img.alt = producto.nombre;
        img.style.display = 'none'; // Ocultamos todas las imágenes inicialmente
        carousel.appendChild(img);
    });

    // Mostramos la primera imagen y configuramos el carrusel
    if (carousel.firstChild) {
        carousel.firstChild.style.display = 'block';
    }

    let slideIndex = 0;
    setInterval(() => {
        const slides = carousel.querySelectorAll("img");
        slides[slideIndex].style.display = 'none'; // Ocultamos la imagen actual
        slideIndex = (slideIndex + 1) % slides.length; // Incrementamos el índice
        slides[slideIndex].style.display = 'block'; // Mostramos la siguiente imagen
    }, 3000);
}

loadProductos();

async function editProducto(id) {
    const nombre = prompt("Nuevo nombre:");
    const cantidad = prompt("Nueva cantidad:");
    const precio = prompt("Nuevo precio:");
    const descripcion = prompt("Nueva descripción:");
    const imagen_url = prompt("Nueva URL de la imagen:");

    const response = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cantidad, precio, descripcion, imagen_url })
    });

    if (response.ok) {
        alert('Producto actualizado con éxito');
        loadProductos();
    } else {
        alert('Error al actualizar producto');
    }
}

async function deleteProducto(id) {
    const response = await fetch(`/productos/${id}`, { method: 'DELETE' });
    if (response.ok) {
        alert('Producto eliminado con éxito');
        loadProductos();
    } else {
        alert('Error al eliminar producto');
    }
}
