/* datos-productos.js */
const productosDB = {
    // --- KITS ---
    "kit-aromaticas": {
        nombre: "Kit de Aromáticas de Cocina",
        precio: 49900,
        descripcion: "Tu huerto personal de chef. Este kit 'todo en uno' trae las cuatro hierbas indispensables para la cocina colombiana (Albahaca, cilantro, perejil y menta). Incluye macetas biodegradables que caben perfectamente en el alféizar de tu ventana.",
        imagen: "/Images/productos/Kit de Aromáticas de Cocina.jpg", // Asegúrate de tener esta imagen
        categoria: "Kits",
        specs: { "Dificultad": "Baja", "Luz": "Media", "Riego": "Interdiario", "Contenido": "4 variedades" }
    },
    "kit-balcon": {
        nombre: "Kit de Hortalizas de Balcón",
        precio: 55000,
        descripcion: "Convierte tu balcón en una despensa viva. Seleccionamos variedades compactas de tomates cherry, lechugas y pimientos que prosperan en macetas.",
        imagen: "/images/productos/Kit de Hortalizas de Balcón.jpg", // Asegúrate de tener esta imagen
        categoria: "Kits",
        specs: { "Dificultad": "Media", "Luz": "Alta", "Espacio": "Exterior", "Cosecha": "60-90 días" }
    },
    "kit-flores": {
        nombre: "Kit de Flores Comestibles",
        precio: 48000,
        descripcion: "Dale color y sabor a tus platos. Incluye Capuchinas y Caléndulas. Hermosas para ver, deliciosas para comer y atraen polinizadores.",
        imagen: "/images/productos/Kit de Flores Ornamentales.jpg", // Asegúrate de tener esta imagen
        categoria: "Kits",
        specs: { "Dificultad": "Baja", "Luz": "Muy Alta", "Uso": "Decoración Culinaria" }
    },
    "kit-starter": {
        nombre: "Kit Starter Principiantes",
        precio: 35000,
        descripcion: "¿Miedo a matar las plantas? Este kit es a prueba de fallos. Semillas resistentes y de germinación rápida con guía paso a paso.",
        imagen: "/images/productos/Kit Starter para Principiantes.jpg", // Asegúrate de tener esta imagen
        categoria: "Kits",
        specs: { "Dificultad": "Muy Baja", "Éxito": "Garantizado", "Ideal": "Niños/Novatos" }
    },
    "kit-medicinal": {
        nombre: "Kit de Plantas Medicinales",
        precio: 52000,
        descripcion: "Cultiva tu propio bienestar. Una selección relajante de plantas (Manzanilla, Hierbabuena y Lavanda) perfectas para infusiones naturales, aromaterapia y aliviar el estrés.",
        imagen: "/images/productos/Kit de Plantas Medicinales.jpg", // Asegúrate de tener esta imagen
        categoria: "Kits",
        specs: { "Dificultad": "Media", "Luz": "Media/Alta", "Uso": "Infusiones", "Aroma": "Intenso" }
    },

    // --- SEMILLAS ---
    "semilla-albahaca": {
        nombre: "Semillas de Albahaca Genovesa",
        precio: 8000,
        descripcion: "La reina del pesto. Hojas grandes, curvadas y muy aromáticas. Ideal para cultivar en interior cerca de una ventana.",
        imagen: "/images/productos/Semillas de Albahaca Genovesa.jpg", // Asegúrate de tener esta imagen
        categoria: "Semillas",
        specs: { "Germinación": "5-10 días", "Ciclo": "Anual", "Clima": "Cálido" }
    },
    "semilla-tomate": {
        nombre: "Semillas Tomate Cherry",
        precio: 8500,
        descripcion: "Explosiones de dulzura roja. Variedad indeterminada de alto rendimiento diseñada para macetas profundas.",
        imagen: "/images/productos/Semillas de Tomate Cherry.jpg", // Asegúrate de tener esta imagen
        categoria: "Semillas",
        specs: { "Germinación": "7-14 días", "Luz": "Sol Directo", "Cosecha": "90 días" }
    },
    "semilla-cilantro": {
        nombre: "Semillas de Cilantro",
        precio: 7500,
        descripcion: "Crecimiento vigoroso y lento espigado. Indispensable para el sancocho y guacamole.",
        imagen: "/images/productos/Semillas de Cilantro.jpg", // Asegúrate de tener esta imagen
        categoria: "Semillas",
        specs: { "Germinación": "7-10 días", "Uso": "Hojas/Semillas", "Sol": "Parcial" }
    },
    "semilla-lechuga": {
        nombre: "Semillas de Lechuga Batavia",
        precio: 7800,
        descripcion: "Hojas crujientes con bordes rizados. Esta variedad es resistente al calor, lo que la hace perfecta para cultivar en balcones donde pega el sol.",
        imagen: "/images/productos/Semillas de Lechuga Batavia.jpg", // Asegúrate de tener esta imagen
        categoria: "Semillas",
        specs: { "Germinación": "4-7 días", "Textura": "Crujiente", "Cosecha": "45 días" }
    },
    
    // --- HERRAMIENTAS ---
    "set-herramientas": {
        nombre: "Set Herramientas Básicas",
        precio: 45000,
        descripcion: "Lo esencial no tiene por qué ser aburrido. Incluye pala ancha, pala estrecha y rastrillo con mangos ergonómicos.",
        imagen: "/images/productos/Set de Herramientas Básicas.jpg", // Asegúrate de tener esta imagen
        categoria: "Herramientas",
        specs: { "Material": "Acero/Madera", "Piezas": "3", "Durabilidad": "Alta" }
    },
    "set-macetas": {
        nombre: "Set de 3 Macetas Ecológicas",
        precio: 28000,
        descripcion: "Cuidan tus plantas y el planeta. Fabricadas con fibra de coco prensada, permiten que las raíces respiren mejor y son 100% biodegradables.",
        imagen: "/images/productos/Set de 3 Macetas Ecológicas.jpg", // Asegúrate de tener esta imagen
        categoria: "Accesorios",
        specs: { "Material": "Fibra de Coco", "Cantidad": "3 unidades", "Eco-friendly": "Sí" }
    },
    "sustrato-premium": {
        nombre: "Sustrato Premium (5 Litros)",
        precio: 18500,
        descripcion: "El secreto de un buen crecimiento. Mezcla balanceada de tierra negra, humus de lombriz y perlita para asegurar el drenaje y la nutrición perfecta.",
        imagen: "/images/productos/Sustrato Premium (5 Litros).jpg", // Asegúrate de tener esta imagen
        categoria: "Sustratos",
        specs: { "Volumen": "5 Litros", "Composición": "Orgánica", "PH": "Neutro", "Drenaje": "Alto" }
    }
};