import type { EmailCopy } from "../types";

export const es: EmailCopy = {
  footer: {
    reason: "Recibes este correo porque pediste el plan semanal gratis en studentplanlegger.no.",
    signature: "Un saludo, Studentplanlegger",
    unsubscribeSubject: "Baja",
  },
  leadMagnet: {
    subject: "Tu muestra del Plan semanal está lista",
    preheader: "De lunes a miércoles en PDF rellenable. Descárgalo ya: el enlace dura 7 días.",
    label: "MUESTRA GRATIS",
    heading: "Tu plan semanal ya está listo",
    intro:
      "¡Hola! Qué bien que quieras probar el Plan semanal. Aquí tienes la primera página: metas, prioridades, tareas y hábitos, y el horario de lunes a miércoles.",
    note: "Es una muestra, no el producto completo. Pero es una página real del planificador, con campos que puedes rellenar directamente en el PDF.",
    imageAlt:
      "La muestra: primera página del Plan semanal con metas, prioridades, tareas y de lunes a miércoles",
    button: "Descargar el plan semanal",
    buttonMeta: ["PDF rellenable", "A4", "el enlace dura 7 días"],
    textDownload: "Descarga el plan semanal (PDF rellenable, A4, el enlace dura 7 días):",
    tipsHeading: "Cómo usarlo",
    tips: [
      {
        title: "Ábrelo con Adobe Acrobat Reader.",
        body: "Es gratis en el ordenador y en el móvil. Así puedes escribir directamente en los campos y guardar.",
      },
      {
        title: "Reserva diez minutos el domingo por la noche.",
        body: "Apunta las metas de la semana y tus tres prioridades antes de rellenar el horario.",
      },
      {
        title: "Guarda primero una copia en blanco.",
        body: "Así tendrás una página nueva lista para la semana que viene. O imprímelo y usa boli.",
      },
    ],
    upsellHeading: "¿Quieres la semana entera?",
    upsellBody:
      "El Plan semanal completo tiene dos páginas, también de jueves a domingo, y cuesta {single}. Si lo quieres todo, tienes los 25 planificadores en el pack completo por {komplett}.",
    linkWeekly: "Ver el Plan semanal",
    linkKomplett: "Ver el pack completo",
    closing: "¡Que tengas una buena semana! Si tienes cualquier duda, responde a este correo.",
    footerUnsubscribe:
      "¿No quieres recibir más correos? Responde «baja» o escribe a {email} y te daremos de baja.",
    footerPrivacy: "Lee nuestra {privacy}.",
    privacyLink: "política de privacidad",
    textPrivacyLabel: "Privacidad",
  },
  welcome: {
    unsubscribeLink: "Darte de baja",
    privacyLink: "Privacidad",
    emails: [
      {
        subject: "Cómo sacarle partido a tu plan semanal",
        body: "¡Hola! ¿Ya has probado el plan semanal? Un pequeño consejo: dedica diez minutos el domingo por la noche a apuntar clases, entregas y trabajo, y luego elige tres cosas que <em>sí o sí</em> tienes que hacer. Así el lunes es mucho más tranquilo. Si tienes alguna duda, responde a este correo.",
      },
      {
        subject: "Cuando se acercan los exámenes",
        body: "Seis semanas antes de los exámenes, conviene repartir el temario entre las semanas que quedan, para no tener que estudiarlo todo la última semana. En el pack completo tienes un planificador anual, uno mensual y el plan semanal, que encajan entre sí, y todos son PDF rellenables que puedes usar en la tablet o el ordenador.",
        button: "Ver el pack",
      },
      {
        subject: "Los 25 planificadores en un solo pack",
        body: "¿Te gusta el plan semanal? Pues tienes el pack completo por {bundlePrice}. Es un pago único, sin suscripción, y lo descargas al momento. Si estás en una asociación de estudiantes en Noruega, puede que te den un 20 % de descuento con su código.",
        button: "Comprar el pack completo",
      },
    ],
  },
};
