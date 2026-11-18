import Link from "next/link";
import type { LegalCopy } from "./types";

// Spanish privacy policy and terms of sale. The Norwegian pages are legally binding.

export const es: LegalCopy = {
  personvern: {
    metaTitle: "Política de privacidad — Studentplanlegger",
    metaDescription:
      "Cómo trata Studentplanlegger los datos personales en las compras, la muestra gratis y el boletín. Contacto: hei@studentplanlegger.no.",
    orgLine: "Studentplanlegger Davidson · N.º de org. 937416156",
    title: "Política de privacidad",
    updated: "Última actualización: 18 de noviembre de 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Quiénes somos</h2>
          <p>
            Studentplanlegger.no está gestionada por Studentplanlegger Davidson, n.º de org.
            937416156. Vendemos planificadores en PDF rellenable como descargas digitales.
          </p>
          <p>
            <strong>Contacto:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Qué datos recopilamos</h2>
          <p>Cuando haces una compra, recopilamos los siguientes datos personales:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre</li>
            <li>Apellido</li>
            <li>Correo electrónico</li>
          </ul>
          <p>
            Estos datos son necesarios para tramitar tu pedido y enviarte un enlace de descarga
            de los productos que has comprado.
          </p>
          <p>
            Cuando envías el formulario de{" "}
            <Link href="/es/gratis" className="text-brand-accent hover:underline">
              /gratis
            </Link>{" "}
            o de la página de inicio, recopilamos tu correo electrónico para el boletín, la serie
            de bienvenida y la muestra gratis del plan semanal. Si llegaste a través de un enlace
            de campaña, también guardamos los valores de campaña (UTM) asociados a ese registro.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Boletín y muestra gratis</h2>
          <p>
            Recopilamos tu <strong>correo electrónico</strong> cuando envías el formulario de
            /gratis o de la página de inicio.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Finalidad:</strong> enviarte la muestra gratis del plan semanal, una serie de
              bienvenida y correos periódicos con consejos de estudio e información sobre
              productos.
            </li>
            <li>
              <strong>Base jurídica:</strong> el consentimiento (al enviar el formulario). Puedes
              retirar tu consentimiento en cualquier momento.
            </li>
            <li>
              <strong>Responsable del tratamiento:</strong> Studentplanlegger Davidson, n.º de org.
              937416156.
            </li>
            <li>
              <strong>Encargados del tratamiento:</strong> Resend (envío de correos, lista de
              contactos y serie de bienvenida) y Supabase (registro de contactos y pedidos).
            </li>
            <li>
              <strong>Datos guardados:</strong> correo electrónico, origen (por ejemplo,
              gratis-ukeplan), fecha y hora del consentimiento, estado de baja, campos de
              campaña/UTM cuando existan y qué campañas de correo has recibido (muestra y serie de
              bienvenida). Los datos se guardan en Resend Contacts (segmento lead-gratis-ukeplan) y
              en las tablas leads y lead_campaigns de Supabase hasta que nos pidas que los borremos
              o te des de baja, o hasta que dejen de ser relevantes.
            </li>
            <li>
              <strong>Darse de baja:</strong> responde a{" "}
              <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                hei@studentplanlegger.no
              </a>{" "}
              pidiendo la baja, o usa el enlace del correo cuando esté disponible.
            </li>
          </ul>
          <p>
            Los derechos que se indican más abajo (acceso, rectificación, supresión y reclamación
            ante Datatilsynet, la autoridad noruega de protección de datos) también se aplican a
            los datos del boletín.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Pago</h2>
          <p>
            Ofrecemos pago a través de Stripe y Vipps. Toda la información de pago (número de
            tarjeta, datos de Vipps) la gestiona directamente el proveedor de pago. Nunca
            guardamos información de tarjetas ni de pagos en nuestros servidores.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies y seguimiento</h2>
          <p>
            <strong>No usamos cookies de seguimiento de terceros</strong>. El carrito y el proceso
            de pago solo usan lo técnicamente necesario. Además, instalamos una cookie propia,{" "}
            <code>sp_campaign</code>, durante un máximo de 30 días con los valores UTM de los
            enlaces de campaña, para poder vincular una compra o un registro en /gratis con la
            campaña de la que vienes. No se envía a redes publicitarias.
          </p>
          <p>
            Para entender cómo se usa la web, contamos con estadísticas anónimas de visitas de{" "}
            <strong>Vercel Web Analytics</strong>. No usa cookies ni guarda nada en tu
            dispositivo. Vemos las páginas vistas y eventos sencillos, por ejemplo, que alguien ha
            hecho clic en un botón, ha añadido un planificador al carrito o ha completado una
            compra, junto con el producto, el nivel de precio y el enlace de campaña del que
            procede la visita. Las estadísticas no contienen nombres, correos electrónicos ni nada
            que te identifique, y los enlaces de descarga se eliminan de las direcciones antes de
            enviarse. Vercel es el encargado del tratamiento de las estadísticas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Idioma y moneda</h2>
          <p>
            Usamos dos cookies funcionales estrictamente necesarias para mostrar la web en el
            idioma correcto y con los precios en la moneda adecuada. No requieren consentimiento,
            no se usan para hacer seguimiento y no se comparten con nadie.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>NEXT_LOCALE</code>: recuerda el idioma que elegiste en el menú de idiomas, para
              que la próxima vez veas la misma versión. Se instala cuando eliges un idioma.
              Duración: 1 año.
            </li>
            <li>
              <code>sp_currency</code>: recuerda en qué moneda se muestran los precios (por ejemplo,
              NOK o EUR). La instala la web en tu primera visita, según el país desde el que nos
              visitas. Duración: 1 año.
            </li>
          </ul>
          <p>
            Para elegir el idioma y la moneda, usamos el país al que pertenece tu dirección IP, que
            nuestro proveedor de alojamiento, Vercel, nos transmite en cada visita. El país solo se
            usa para esta elección, y no guardamos ni el país ni tu dirección IP.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cómo usamos los datos</h2>
          <p>Tus datos personales solo se usan para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tramitar y entregar tu pedido</li>
            <li>Enviarte la confirmación y el enlace de descarga por correo electrónico</li>
            <li>Ponernos en contacto contigo si hay algún problema con tu pedido</li>
            <li>
              Enviarte la muestra gratis, la serie de bienvenida y el boletín a los que hayas dado
              tu consentimiento
            </li>
          </ul>
          <p>
            Nunca vendemos ni compartimos tus datos personales con terceros con fines de
            marketing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Almacenamiento y seguridad</h2>
          <p>
            La información de los pedidos y los contactos se guardan de forma segura en nuestro
            proveedor de base de datos (Supabase), con cifrado y control de acceso. El servidor usa
            una clave de servicio; los navegadores normales no tienen acceso de lectura ni de
            escritura a las tablas de contactos. Conservamos los datos el tiempo necesario para
            completar el pedido, enviarte los correos a los que hayas dado tu consentimiento y
            cumplir la bokføringsloven (la ley noruega de contabilidad).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Tus derechos</h2>
          <p>
            Según la personopplysningsloven (la ley noruega de datos personales) y el RGPD, tienes
            derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Solicitar acceso a los datos que tenemos sobre ti</li>
            <li>Solicitar la rectificación de datos inexactos</li>
            <li>Solicitar la supresión de tus datos</li>
            <li>
              Presentar una reclamación ante Datatilsynet si crees que tratamos tus datos
              incumpliendo la normativa
            </li>
          </ul>
          <p>
            Escríbenos a{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            para ejercer tus derechos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Legislación aplicable</h2>
          <p>
            Esta política de privacidad se rige por la legislación noruega, incluida la
            personopplysningsloven y el Reglamento General de Protección de Datos de la UE (RGPD).
          </p>
        </section>
      </>
    ),
  },
  vilkar: {
    metaTitle: "Condiciones de venta — Studentplanlegger",
    metaDescription:
      "Condiciones de venta de los planificadores en PDF rellenable de Studentplanlegger. Precios, entrega, derecho de desistimiento y condiciones de uso.",
    orgLine: "Studentplanlegger Davidson · N.º de org. 937416156",
    title: "Condiciones de venta",
    updated: "Última actualización: 18 de noviembre de 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Sobre el servicio</h2>
          <p>
            Studentplanlegger.no vende productos digitales en forma de planificadores en PDF
            rellenable. Todos los productos se entregan como descarga digital inmediata una vez
            completado el pago.
          </p>
          <p>
            <strong>Vendedor:</strong> Empresa individual (registro en trámite a través de Altinn)
          </p>
          <p>
            <strong>Contacto:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Precios y pago</h2>
          <p>
            Los precios se muestran en tu moneda local si la admitimos (NOK, SEK, DKK, EUR, GBP o
            USD) y, si no, en dólares estadounidenses, e incluyen el impuesto sobre el valor
            añadido (IVA). Pagas el importe que se muestra en el proceso de pago.
          </p>
          <p>
            Ofrecemos pago con tarjeta a través de Stripe en todas estas monedas, y Vipps para
            pagos en coronas noruegas (NOK). El pago se realiza antes de la entrega del producto.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Entrega</h2>
          <p>
            En cuanto se completa el pago, recibes al instante un enlace de descarga. También
            recibirás una confirmación por correo electrónico con un enlace a la descarga.
          </p>
          <p>
            El enlace de descarga es válido durante <strong>7 días</strong> desde el momento de la
            compra, con un máximo de <strong>10 descargas</strong> por pedido.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Derecho de desistimiento</h2>
          <p>
            Según el artículo 22, letra n), de la angrerettloven (la ley noruega de derecho de
            desistimiento), el derecho de desistimiento no se aplica al suministro de contenido
            digital que no se entrega en un soporte físico cuando la entrega ha comenzado con el
            consentimiento previo y expreso del consumidor y este ha reconocido que, en
            consecuencia, pierde el derecho de desistimiento.
          </p>
          <p>
            Al completar la compra, das tu consentimiento a la entrega inmediata del contenido
            digital y aceptas que se pierde el derecho de desistimiento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Condiciones de uso de los productos</h2>
          <p>
            Los productos que compras son solo para <strong>uso personal</strong>. No puedes:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Revender ni distribuir los productos</li>
            <li>Compartir el enlace de descarga con otras personas</li>
            <li>Usar los productos con fines comerciales sin un acuerdo por escrito</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Reclamaciones y asistencia</h2>
          <p>
            Si tienes problemas con la descarga o el producto no funciona como esperabas,
            escríbenos a{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            y te ayudaremos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Legislación aplicable</h2>
          <p>
            Estas condiciones de venta se rigen por la legislación noruega. Cualquier conflicto se
            intentará resolver de forma amistosa. Si no es posible, el asunto podrá someterse a
            Forbrukerrådet (el Consejo Noruego de Consumidores) o a los tribunales ordinarios.
          </p>
        </section>
      </>
    ),
  },
};
