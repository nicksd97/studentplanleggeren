import type { Messages } from "./types";

// Spanish UI copy (neutral international Spanish, "tú").

export const es: Messages = {
  switcher: { label: "Idioma" },
  header: {
    planners: "Planificadores",
    free: "Muestra gratis",
    bundles: "Packs",
    faq: "Preguntas frecuentes",
    buyKomplett: "Compra el pack completo con Vipps",
    cart: "Carrito",
    menu: "Menú",
  },
  footer: {
    tagline: "Planificadores y herramientas de productividad pensados para estudiantes.",
    products: "Productos",
    komplett: "Pack completo",
    daily: "Pack diario",
    weekly: "Pack semanal",
    all: "Todos los planificadores",
    guides: "Guías",
    info: "Información",
    faq: "Preguntas frecuentes",
    free: "Muestra gratis",
    privacy: "Privacidad",
    terms: "Condiciones",
    madeWith: "Hecho con cariño en Noruega",
    orgNo: "N.º de org.",
  },
  hero: {
    label: "✦ Pensado para estudiantes ✦",
    tagline: "Organiza tus estudios.",
    intro:
      "25 planificadores en PDF rellenable para estudiantes. Diarios, semanales, mensuales: imprímelos o rellénalos directamente en la pantalla.",
    komplett: "Ver el pack completo — {komplett}",
    explore: "Explora los planificadores",
    trust: ["Paga con Vipps o tarjeta", "PDF rellenables", "Descarga inmediata"],
    trustNoVipps: "Pago seguro con tarjeta",
    coverAlt: "Productos de Studentplanlegger: 25 planificadores en PDF rellenable",
  },
  devices: {
    label: "✦ Úsalo donde quieras ✦",
    heading: "Funciona en todos tus dispositivos",
    intro:
      "Rellena los planificadores en digital en tu PC, Mac, iPad o tableta, o imprímelos en papel. Tú eliges.",
    cards: [
      {
        alt: "Rellena el planificador en digital en un PC, Mac, iPad o tableta",
        label: "Rellénalo en digital",
        subtext: "En PC, Mac, iPad o tableta",
      },
      {
        alt: "Planificadores anuales, mensuales, semanales y diarios",
        label: "Anuales, mensuales, semanales y diarios",
        subtext: "Un planificador para cada necesidad",
      },
      {
        alt: "Disponible en varios tamaños: A4, A5, Letter y Half Letter",
        label: "Varios tamaños",
        subtext: "A4, A5, Letter y Half Letter",
      },
    ],
  },
  categories: {
    label: "✦ Explora las categorías ✦",
    heading: "¿Qué necesitas?",
    planners: "planificadores",
  },
  painPoints: {
    label: "✦ ¿Te suena? ✦",
    heading: "Para ti si...",
    cards: [
      {
        title: "...nunca sabes por dónde empezar",
        description:
          "Inicio de semestre, exámenes, proyectos: hay mucho que controlar. Los planificadores diarios y semanales te dan una visión clara desde el primer día.",
      },
      {
        title: "...quieres crear mejores hábitos",
        description:
          "Empezar es fácil; mantenerlo, no tanto. El Registro de hábitos y el Reto de 30 días te ayudan a no dejarlo a medias.",
      },
      {
        title: "...quieres alcanzar tus metas",
        description:
          "Ya sean metas de notas, de forma física o de ahorro, el Planificador de metas y el Plan de acción convierten los grandes objetivos en pasos concretos.",
      },
    ],
  },
  bundleShowcase: {
    label: "✦ Todo lo que necesitas ✦",
    heading: "Studentplanlegger Completo",
    includedTitle: "Incluye 25 planificadores:",
    includes: [
      "5 planificadores diarios",
      "5 planificadores semanales",
      "3 planificadores mensuales",
      "1 planificador anual",
      "5 herramientas de productividad",
      "3 de salud y estilo de vida",
      "3 herramientas de seguimiento",
    ],
    buyKomplett: "Compra el pack completo con Vipps — {price}",
    addKomplett: "Añade el pack completo al carrito — {price}",
    seeAll: "Ver los 25 planificadores",
    orPick: "✦ O elige un pack ✦",
    packsNote:
      "Packs temáticos a {theme}. Mete cinco planificadores sueltos cualesquiera en el carrito por {fivePack}.",
    bundleMeta: "{count} planificadores · {price}",
    buy: "Comprar",
    alreadyInCart: "Ya está en tu carrito",
    added: "Añadido ✓",
  },
  howItWorks: {
    label: "✦ Rápido y sencillo ✦",
    heading: "Cómo funciona",
    step: "Paso",
    steps: [
      {
        title: "Elige",
        description:
          "Escoge la herramienta o el pack que mejor se adapte a ti. Planificadores sueltos desde {single}, pack de 5 a {fivePack} y packs desde {theme}.",
      },
      {
        title: "Paga",
        description:
          "Pago seguro con Vipps o tarjeta bancaria. Sin suscripción: pagas una vez y el producto es tuyo para siempre.",
      },
      {
        title: "Descarga",
        description:
          "Descarga los archivos al momento: PDF rellenables para imprimir o usar en digital. Listos en menos de un minuto.",
      },
    ],
    payNoVipps:
      "Pago seguro con tarjeta. Sin suscripción: pagas una vez y el producto es tuyo para siempre.",
  },
  testimonials: {
    label: "✦ De estudiantes como tú ✦",
    heading: "Lo que dicen otros",
    note: "Citas traducidas del noruego.",
    quotes: [
      {
        quote:
          "El Planificador diario ha cambiado mi rutina de las mañanas. Dedico 5 minutos a planificar el día y me cunde mucho más.",
        study: "Derecho, UiO",
      },
      {
        quote:
          "El Plan semanal es genial para organizar el semestre. Por fin veo toda la semana de un vistazo en lugar de olvidarme de cosas.",
        study: "Enfermería, NTNU",
      },
      {
        quote:
          "Me encanta poder rellenarlo directamente en el iPad. No tengo que imprimir nada y aun así queda bonito.",
        study: "Economía, NHH",
      },
    ],
  },
  faq: { label: "✦ ¿Tienes dudas? ✦", heading: "Preguntas frecuentes" },
  guideList: {
    label: "✦ Guías ✦",
    heading: "Consejos para tu día a día como estudiante",
    read: "Leer la guía",
  },
  guidePage: { home: "Inicio", guide: "Guía" },
  newsletter: {
    heading: "Muestra gratis del plan semanal",
    subheading:
      "Recibe por correo una muestra rellenable del plan semanal: una página, no el producto completo.",
    buttonLabel: "Envíame la muestra",
    successMessage: "¡Gracias! Revisa tu bandeja de entrada: la muestra ya va de camino.",
    error: "Algo ha salido mal. Inténtalo de nuevo.",
    emailLabel: "Correo electrónico",
    placeholder: "tu@ejemplo.com",
    sending: "Enviando...",
    consentBefore:
      "Al enviar el formulario, aceptas que guardemos tu correo electrónico para enviarte la muestra y consejos de estudio periódicos (los correos están en noruego). Lee la ",
    consentLink: "política de privacidad",
    consentAfter: ".",
  },
  gratis: {
    label: "MUESTRA GRATIS",
    heading: "Descarga gratis una muestra del plan semanal",
    intro:
      "Un PDF rellenable de una página para que pruebes el formato antes de comprar. No es el planificador completo, solo un extracto del plan semanal.",
    bullets: [
      "Campos rellenables para metas, prioridades, tareas, hábitos y de lunes a miércoles",
      "Una página real del Plan semanal, con el mismo diseño que la versión completa",
      "El plan semanal completo y otros 24 PDF están en la tienda",
    ],
    formHeading: "Recibe la muestra por correo",
    formText:
      "Escribe tu correo electrónico. Te enviaremos un enlace de descarga, no el producto completo.",
    cta: "Ver todos los planificadores — desde {single}",
    komplett: "Pack completo con 25 planificadores: {komplett}.",
  },
  notFound: {
    heading: "Página no encontrada",
    text: "No hemos encontrado la página que buscas. Echa un vistazo a los planificadores o vuelve a la página de inicio.",
    home: "Ir a la página de inicio",
    planners: "Ver los planificadores",
  },
  catalog: {
    prices:
      "{single} por planificador. Mete cinco cualesquiera en el carrito y paga {fivePack}.",
    nav: "Categorías de productos",
    allTab: "Todos",
  },
  productCard: {
    alreadyInCart: "Ya está en tu carrito",
    added: "Añadido ✓",
    badge: "PDF rellenable",
    pages: "páginas",
    buy: "Comprar ahora",
  },
  stickyBar: {
    title: "Studentplanlegger Completo: los 25 por {komplett}",
    subtitle: "Los 25 PDF rellenables",
    alreadyInCart: "Ya está en tu carrito",
    added: "Añadido ✓",
    add: "Añadir al carrito",
  },
  cart: {
    title: "Carrito",
    close: "Cerrar",
    empty: "Tu carrito está vacío",
    seeProducts: "Ver productos",
    remove: "Quitar {name}",
    onePack: "Pack de 5: cinco planificadores por {fivePack}",
    manyPacks: "{packs} × pack de 5 por {price}",
    singles: " + {count} por separado",
    addMore: "Añade {count} más y llévate el pack de 5 por {fivePack}.",
    total: "Total",
    checkout: "Ir a pagar",
    clear: "Vaciar carrito",
  },
  komplettVipps: {
    label: "Compra el pack completo con Vipps",
    error: "No se ha podido iniciar el pago con Vipps",
  },
  kasse: {
    errors: {
      firstName: "El nombre es obligatorio",
      lastName: "El apellido es obligatorio",
      email: "El correo electrónico es obligatorio",
      emailInvalid: "Correo electrónico no válido",
      confirm: "Confirma tu correo electrónico",
      mismatch: "Los correos electrónicos no coinciden",
    },
    invalidCode: "Código no válido",
    codeActive:
      "El código {code} está activo: {percent} % para {association}. Pagas {amount}.",
    cancelled: "El pago se ha cancelado o ha fallado. No se ha completado ningún pedido.",
    genericError: "Algo ha salido mal. Inténtalo de nuevo.",
    emptyTitle: "Tu carrito está vacío",
    emptyText: "Añade algún producto antes de ir a pagar.",
    seeProducts: "Ver productos",
    title: "Pago",
    steps: ["Datos", "Pago", "Descarga"],
    details: "Tus datos",
    firstName: "Nombre",
    firstNamePlaceholder: "Lucía",
    lastName: "Apellido",
    lastNamePlaceholder: "García",
    email: "Correo electrónico",
    emailPlaceholder: "lucia@example.com",
    confirmEmail: "Confirma tu correo electrónico",
    summary: "Resumen del pedido",
    remove: "Quitar {name}",
    fivePack: "Pack de 5",
    singleOne: "1 planificador suelto",
    singleOther: "{count} planificadores sueltos",
    discountCode: "Código de descuento",
    discountPlaceholder: "p. ej. ABAKUS20",
    apply: "Aplicar",
    listPrice: "Precio de lista {amount}",
    total: "Total",
    payVipps: "Pagar con Vipps",
    recommended: "Recomendado",
    or: "o",
    payCard: "Pagar con tarjeta",
    cardDisabled: "El pago con tarjeta aún no está disponible. Paga con Vipps.",
    secure: "Pago seguro · Descarga inmediata",
    acceptTerms: "Al comprar, aceptas nuestras condiciones de venta",
  },
  takk: {
    errorTitle: "Algo ha salido mal",
    errorText:
      "No hemos encontrado tu pedido. Revisa tu correo o escríbenos y te ayudaremos.",
    home: "Volver a la página de inicio",
    paidTitle: "¡Gracias por tu compra!",
    cancelledTitle: "El pago se ha cancelado",
    pendingTitle: "Esperando el pago",
    confirmationSent: "Hemos enviado una confirmación a",
    readyNoEmail: "Tu descarga está lista. Guarda esta página si no has recibido ningún correo.",
    cancelledText: "El pago no se ha confirmado, así que la descarga no se ha activado.",
    pendingText: "Estamos esperando a que se confirme el pago. No cierres esta página.",
    products: "Tus productos",
    download: "Descargar",
    downloadsLeft: "Te quedan {count} descargas",
    expires: "El enlace caduca",
    expired: "El enlace de descarga ha caducado. Escríbenos y te ayudaremos.",
    activatesOnPayment: "Las descargas se activan en cuanto se confirma el pago",
  },
  legalNote: {
    before: "Esta es una traducción al español que ofrecemos para tu comodidad. La ",
    link: "versión noruega",
    after: " es la única jurídicamente vinculante.",
  },
  pdfLanguage: {
    available: {
      sentence: "Todos los planificadores están disponibles en español.",
      short: "En español",
    },
    norwegian: {
      sentence: "Los planificadores están en noruego (bokmål).",
      short: "En noruego (bokmål)",
    },
  },
  apiErrors: {
    "Ugyldig forespørsel": "Solicitud no válida.",
    "Ugyldig e-postadresse": "Correo electrónico no válido.",
    "For mange forsøk. Prøv igjen senere.": "Demasiados intentos. Inténtalo de nuevo más tarde.",
    "Kunne ikke lage nedlastingslenke": "No se ha podido crear el enlace de descarga.",
    "Nyhetsbrev er ikke konfigurert": "El boletín todavía no está configurado.",
    "Kunne ikke lagre kontakten": "No se ha podido guardar tu correo electrónico.",
    "Kunne ikke sende e-post": "No se ha podido enviar el correo.",
    Serverfeil: "Error del servidor. Inténtalo de nuevo.",
    "Mangler produkter": "Tu carrito está vacío.",
    "Ukjent produkt": "Hay un producto desconocido en el carrito.",
    "Ugyldig betalingsmetode": "Método de pago no válido.",
    "Mangler påkrevde felt": "Rellena todos los campos obligatorios.",
    "Kunne ikke starte kortbetaling": "No se ha podido iniciar el pago con tarjeta.",
    "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
      "Todavía no se pueden cobrar pagos con tarjeta. La cuenta de Stripe no está activada.",
    "Kunne ikke opprette ordre": "No se ha podido crear el pedido.",
    "Kunne ikke starte Vipps-betaling": "No se ha podido iniciar el pago con Vipps.",
    "Ugyldig eller utløpt rabattkode": "El código de descuento no es válido o ha caducado.",
    "Ugyldig kode": "Código no válido.",
    "Ugyldig valuta": "Esta moneda no está disponible.",
    "Vipps kan bare brukes ved betaling i norske kroner (NOK)":
      "Vipps solo se puede usar al pagar en coronas noruegas (NOK).",
  },
  genericError: "Algo ha salido mal. Inténtalo de nuevo.",
  products: {
    "daglig-gjennomgang": {
      name: "Revisión diaria",
      description:
        "Hoja de revisión y reflexión diaria: resume el día, anota lo que ha ido bien y lo que quieres mejorar.",
      features: ["Resumen del día", "Reflexión", "Aspectos a mejorar"],
    },
    "daglig-helseplan": {
      name: "Plan de salud diario",
      description:
        "Planificador de salud diario: controla el ejercicio, las comidas, el agua que bebes y el sueño.",
      features: ["Registro de ejercicio", "Plan de comidas", "Sueño e hidratación"],
    },
    "daglig-planlegger": {
      name: "Planificador diario",
      description: "Planificador diario con agenda, áreas de enfoque y tareas pendientes.",
      features: ["Agenda del día", "Áreas de enfoque", "Lista de tareas"],
    },
    "daglig-produktivitetsplan": {
      name: "Plan de productividad diario",
      description: "Plan de productividad diario con bloques de tiempo y prioridades.",
      features: ["Bloques de tiempo", "Prioridades", "Enfoque en la productividad"],
    },
    "daglig-timeplan": {
      name: "Horario diario",
      description: "Plan del día hora a hora, de la mañana a la noche.",
      features: ["Plan por horas", "De la mañana a la noche", "Un día estructurado"],
    },
    "ukentlig-gjennomgang": {
      name: "Revisión semanal",
      description:
        "Resumen semanal: reflexiona sobre la semana y fija metas para la siguiente.",
      features: ["Resumen de la semana", "Reflexión", "Fijación de metas"],
    },
    "ukentlig-gjoremaal": {
      name: "Tareas semanales",
      description: "Lista de tareas semanal con espacio para las tareas de cada día.",
      features: ["Tareas diarias", "Visión de la semana", "Campo de prioridad"],
    },
    "ukentlig-matplan": {
      name: "Menú semanal",
      description: "Planificador de comidas semanal con lista de la compra.",
      features: ["Plan de comidas", "Lista de la compra", "Visión de la semana"],
    },
    "ukentlig-plan": {
      name: "Plan semanal",
      description: "Plan semanal completo con áreas de enfoque y bloques diarios.",
      features: ["Áreas de enfoque", "Bloques diarios", "2 páginas"],
    },
    "ukentlig-planlegger": {
      name: "Planificador semanal",
      description: "Planificador semanal sencillo para los estudios y el día a día.",
      features: ["Visión sencilla", "Estudios y día a día", "Plan semanal"],
    },
    "maanedlig-budsjett": {
      name: "Presupuesto mensual",
      description: "Planificador de presupuesto mensual: controla tus ingresos y gastos.",
      features: ["Resumen de ingresos", "Control de gastos", "Balance del presupuesto"],
    },
    "maanedlig-gjennomgang": {
      name: "Revisión mensual",
      description: "Revisión y reflexión mensual.",
      features: ["Resumen del mes", "Reflexión", "2 páginas"],
    },
    "maanedlig-planlegger": {
      name: "Planificador mensual",
      description: "Planificador mensual con una visión general de metas y tareas.",
      features: ["Metas del mes", "Lista de tareas", "Diseño claro"],
    },
    "aarlig-planlegger": {
      name: "Planificador anual",
      description: "Planificador anual con una visión mes a mes y metas para el año.",
      features: ["Visión mensual", "Metas del año", "2 páginas"],
    },
    "pomodoro-planlegger": {
      name: "Planificador Pomodoro",
      description:
        "Planificador de sesiones de estudio Pomodoro con puntuación de productividad.",
      features: ["Temporizador Pomodoro", "Puntuación de productividad", "Planificación de sesiones"],
    },
    "prosjekt-planlegger": {
      name: "Planificador de proyectos",
      description: "Planificación de proyectos con cronograma e hitos.",
      features: ["Cronograma", "Hitos", "Desglose de tareas"],
    },
    "gjoremaal-liste": {
      name: "Lista de tareas",
      description: "Lista de tareas sencilla con campos de prioridad.",
      features: ["Campos de prioridad", "Visión sencilla", "Lista de tareas"],
    },
    handlingsplan: {
      name: "Plan de acción",
      description: "Plan de acción para convertir tus metas en pasos concretos.",
      features: ["Desglose de metas", "Pasos concretos", "Enfoque en la acción"],
    },
    "maal-planlegger": {
      name: "Planificador de metas",
      description: "Hoja para fijar metas con acciones y plazos.",
      features: ["Fijación de metas", "Acciones", "Plazos"],
    },
    "helse-planlegger": {
      name: "Planificador de salud",
      description: "Planificador de salud y forma física con metas de nutrición.",
      features: ["Plan de entrenamiento", "Metas de nutrición", "Seguimiento de la salud"],
    },
    hjemmeplanlegger: {
      name: "Planificador del hogar",
      description: "Planifica las comidas, las tareas de casa y la lista de la compra.",
      features: ["Plan de comidas", "Tareas de casa", "Lista de la compra"],
    },
    "reise-planlegger": {
      name: "Planificador de viajes",
      description:
        "Planifica tus viajes con presupuesto, lista de equipaje e itinerario diario.",
      features: ["Presupuesto del viaje", "Lista de equipaje", "Itinerario diario"],
    },
    "personlig-finans-tracker": {
      name: "Control de finanzas personales",
      description: "Visión general de tus finanzas con ingresos, gastos y ahorros.",
      features: ["Ingresos", "Gastos", "Resumen de ahorros"],
    },
    "vane-tracker": {
      name: "Registro de hábitos",
      description: "Cuadrícula mensual para seguir tus hábitos y crear buenas rutinas.",
      features: ["Cuadrícula mensual", "Categorías flexibles", "Progreso visual"],
    },
    "30-dagers-utfordring": {
      name: "Reto de 30 días",
      description: "Registro de un reto de 30 días para nuevos hábitos o metas.",
      features: ["Seguimiento de 30 días", "Metas de hábitos", "Control diario"],
    },
  },
  bundles: {
    komplett: {
      name: "Studentplanlegger Completo",
      description:
        "Los 25 planificadores. Todo lo que necesitas para tener tus estudios bajo control.",
      badge: "Mejor precio",
    },
    "daglig-pakke": {
      name: "Pack diario",
      description: "Los 5 planificadores diarios en un solo pack.",
    },
    "ukentlig-pakke": {
      name: "Pack semanal",
      description: "Los 5 planificadores semanales en un solo pack.",
    },
    produktivitetspakken: {
      name: "Pack de productividad",
      description: "Las 5 herramientas de productividad en un solo pack.",
    },
  },
  categoryLabels: {
    alle: "Todos",
    daglig: "Diarios",
    ukentlig: "Semanales",
    maanedlig: "Mensuales",
    aarlig: "Anual",
    produktivitet: "Productividad",
    helse: "Salud y estilo de vida",
    sporing: "Seguimiento",
  },
};
