window.onload = function loadbar() {
    x = document.getElementById('loadbar')
    x.style.display = "none";
};


const h1 = document.querySelector('.box_0 h1');


  // h1.addEventListener('mouseenter', () => {
  //   document.body.classList.add('invertido');
  // });

  // h1.addEventListener('mouseleave', () => {
  //   document.body.classList.remove('invertido');
  // });
  

function cas() {
    document.body.classList.toggle('invertido');
  }




function text() {
  const text1 = document.getElementById('text1');
  const text2 = document.getElementById('text2');
  
  // Transición suave
  text1.style.transition = text2.style.transition = 'opacity 0.3s ease';
  
  if (text1.style.display === 'block' || text1.style.display === '') {
    text1.style.opacity = '0';
    setTimeout(() => {
      text1.style.display = 'none';
      text2.style.display = 'block';
      setTimeout(() => text2.style.opacity = '1', 10);
    }, 300);
  } else {
    text2.style.opacity = '0';
    setTimeout(() => {
      text2.style.display = 'none';
      text1.style.display = 'block';
      setTimeout(() => text1.style.opacity = '1', 10);
    }, 300);
  }
}

// Añade estas funciones a tu comentarios.js
function recientes() {
    document.getElementById('recientes').style.display = 'block';
    document.getElementById('agregar').style.display = 'none';
    document.querySelector('.botones_comentarios span:nth-child(1)').style.backgroundColor = 'rgba(0, 0, 0, 0.178)';
    document.querySelector('.botones_comentarios span:nth-child(2)').style.backgroundColor = '';
    cargarComentarios(); // Recargar comentarios al mostrar
  }
  
  function agregar() {
    document.getElementById('recientes').style.display = 'none';
    document.getElementById('agregar').style.display = 'block';
    document.querySelector('.botones_comentarios span:nth-child(1)').style.backgroundColor = '';
    document.querySelector('.botones_comentarios span:nth-child(2)').style.backgroundColor = 'rgba(0, 0, 0, 0.178)';
  }
function enviarCorreo() {
    let email = "uagdahse@anonaddy.me";
    let subject = "Asunto del correo";
    let body = "Hola, este es un ejemplo.";

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function index(){
    let sd = document.getElementById('certifications');
    let ss = document.getElementById('principal');
    let ab = document.getElementById('about');
    ab.style.display = 'none';
    sd.style.display = 'none';
    ss.style.display = 'block'; 
}


function certifications(){
    let sd = document.getElementById('certifications');
    let ab = document.getElementById('about');
    let ss = document.getElementById('principal');
    ss.style.display = 'none';
    ab.style.display = 'none';
    sd.style.display = 'block';

}
function about(){
    let sd = document.getElementById('certifications');
    let ss = document.getElementById('principal');
    let ab = document.getElementById('about');
    ss.style.display = 'none';
    sd.style.display = 'none';
    ab.style.display = 'block';
}




document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".bloque"); 
    const bars = document.querySelectorAll(".bar"); 
    const names = document.querySelectorAll(".name"); 

    boxes.forEach((box, index) => {
        box.addEventListener("click", (event) => {
            event.stopPropagation(); // Evita que el clic se propague al `document`
            
            // Activa el bloque actual
            box.classList.toggle("bloque_activo");

            // Activa la barra correspondiente
            if (bars[index]) {
                bars[index].classList.toggle("bar_activo");
            }

            // Activa el nombre correspondiente
            if (names[index]) {
                names[index].classList.toggle("name_activo");
            }
        });
    });

    // Si se hace clic fuera de los elementos, se desactivan todas las clases
    document.addEventListener("click", () => {
        boxes.forEach((box) => box.classList.remove("bloque_activo"));
        bars.forEach((bar) => bar.classList.remove("bar_activo"));
        names.forEach((name) => name.classList.remove("name_activo"));
    });
});





document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".li-cer"); 
    const bars = document.querySelectorAll(".li-div"); 

    boxes.forEach((box, index) => {
        box.addEventListener("click", (event) => {
            event.stopPropagation(); // Evita que el clic se propague al `document`
            
            // Activa el bloque actual

            // Activa la barra correspondiente
            if (bars[index]) {
                bars[index].classList.toggle("li-div_activo");
            }

   
        });
    });

    // Si se hace clic fuera de los elementos, se desactivan todas las clases
    document.addEventListener("click", () => {
        bars.forEach((bar) => bar.classList.remove("li-div_activo"));
    });
});



function cerrar() {
    const text = document.getElementById('text_info');
    const div = document.getElementById('active');
    if (div) {
        text.style.display = "block";
        div.classList.add('hide'); // Agrega la animación de salida
        setTimeout(() => {
            div.style.display = "none"; // Oculta el div después de la animación
            div.classList.remove('hide'); // Limpia la clase para futuras transiciones
        }, 500); // Tiempo igual al de la animación CSS (0.5s)
    }
}

function cambiarDistro(nombre, imgSrc, tiempo, info) {
    // const text = document.getElementById('info_text');
    const div = document.getElementById('active');
    if (div) {
        // text.style.display = "none";
        div.style.display = "block"; // Muestra el div antes de animarlo
        setTimeout(() => {
            div.classList.add('show'); // Agrega la animación de entrada
        }, 10);
    }

    document.getElementById("img").innerHTML = `<img src="${imgSrc}" alt="${nombre}">`;
    document.getElementById("text").innerHTML = `
        <p>${nombre}</p>
        <p>Tiempo de uso: ${tiempo}</p>
    `;
    document.getElementById('text_info').innerHTML = `<p>${info}</p>`;
}


let currentActive = 0; // Inicia con el primer div (índice 0)
const totalDivs = 2;   // Total de divs a rotar

function rotarDivs() {
    const divs = document.querySelectorAll('[id^="perfil_txt"]');
    divs.forEach(div => div.style.display = 'none');
    
    currentActive = (currentActive % totalDivs) + 1;
    document.getElementById(`perfil_txt${currentActive}`).style.display = 'block';
}

// Inicialización: asegurarse que solo el primer div esté visible al cargar
document.addEventListener('DOMContentLoaded', function() {
    rotarDivs(); // Esto mostrará solo el primer div
});

function toggleVisibility(id) {
    let element = document.getElementById(id);
    element.style.display = (element.style.display === "none" || element.style.display === "") ? "block" : "none";
}


function vistaso2() {
    let h = document.getElementById('i2');

    if (h.style.display === "none" || h.style.display === "") {
        h.style.display = "block"; // Lo mostramos
    } else {
        h.style.display = "none";  // Lo ocultamos
    }
}
function vistaso3() {
    let h = document.getElementById('i3');

    if (h.style.display === "none" || h.style.display === "") {
        h.style.display = "block"; // Lo mostramos
    } else {
        h.style.display = "none";  // Lo ocultamos
    }
}

function toggleTables(table1Id, table2Id) {
    const table1 = document.getElementById(table1Id);
    const table2 = document.getElementById(table2Id);

    const isTable1Visible = table1.style.display === 'block';
    table1.style.display = isTable1Visible ? 'none' : 'block';
    table2.style.display = isTable1Visible ? 'block' : 'none';
}

document.getElementById('textEffect').addEventListener('mousemove', (e) => {
            const container = e.currentTarget;
            const rect = container.getBoundingClientRect();
            
            // Posición relativa del mouse (más suave)
            const x = (e.clientX - rect.left) / rect.width * 2 - 1;
            const y = (e.clientY - rect.top) / rect.height * 2 - 1;
            
            // Aplicar rotación más sutil
            container.style.transform = `
              rotateY(${x * 35}deg)
              rotateX(${y * -35}deg)
              translateY(-5px)
            `;
            
            // Efecto parallax mejorado
            const front = container.querySelector('.front');
            const back = container.querySelector('.back');
            
            front.style.transform = `rotateX(${y * 10}deg) translateZ(20px)`;
            back.style.transform = `
              rotateX(${-90 + (y * 15)}deg)
              translateZ(${15 + (x * 15)}px)
            `;
          });
          
          // Reset mejorado
          document.getElementById('textEffect').addEventListener('mouseleave', (e) => {
            const container = e.currentTarget;
            const front = container.querySelector('.front');
            const back = container.querySelector('.back');
            
            // Animación suave al resetear
            container.style.transition = 'transform 0.3s ease';
            front.style.transition = 'transform 0.3s ease';
            back.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
              container.style.transform = '';
              front.style.transform = '';
              back.style.transform = 'rotateX(-90deg) translateY(-30%)';
              
              // Restauramos la transición rápida después del reset
              setTimeout(() => {
                container.style.transition = 'transform 0.2s ease';
                front.style.transition = 'transform 0.2s ease';
                back.style.transition = 'transform 0.2s ease';
              }, 500);
            }, 10);
          });

          

document.querySelectorAll('.bloque-compact').forEach(block => {
  block.addEventListener('click', function() {
    // Remover clase 'active' de todos los bloques
    document.querySelectorAll('.bloque-compact').forEach(b => {
      b.classList.remove('active');
    });
    // Añadir clase 'active' solo al bloque clickeado
    this.classList.add('active');
  });
});

// JavaScript optimizado
function showTab(tabId) {
  document.querySelectorAll('.skills-container').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';
}

// Inicializar con la primera pestaña visible
showTab('skills_1');

document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', function() {
    // Remove 'active' class and reset background for all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.backgroundColor = ''; // Reset background
    });

    // Add 'active' class and set background for the clicked button
    this.classList.add('active');
    this.style.backgroundColor = ''; // Set background to black
  });
});


