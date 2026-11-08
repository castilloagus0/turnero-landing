# Turnate — Landing SaaS

Landing de Turnate, una plataforma de gestión de turnos. Está construida con Astro y React Islands para interacciones puntuales.

## Tecnologías

- Astro 7 + Tailwind CSS 4
- React Islands (`IndustriesCarousel`, `DemoForm`)
- GSAP + ScrollTrigger y Lenis
- Swiper y Lucide

## Desarrollo

El proyecto requiere Node.js `22.23.4` o superior.

```sh
pnpm install
pnpm astro dev --background
pnpm build
```

El servidor en segundo plano se administra con `pnpm astro dev status`, `pnpm astro dev logs` y `pnpm astro dev stop`.

## Publicación

Definí `PUBLIC_SITE_URL` con el dominio HTTPS definitivo durante el build. Astro lo usa para generar las URL canónicas, las etiquetas para redes sociales y el sitemap. Configurá compresión y caché de assets en el hosting o CDN elegido.

El hero usa un póster optimizado en mobile; el video se carga en escritorio cuando el usuario no solicitó movimiento reducido. Las animaciones de scroll comparten el ticker de GSAP y la instancia de Lenis.

## Formulario de demo

El formulario envía las solicitudes mediante FormSubmit. Antes de recibirlas, hay que confirmar el correo de activación que el servicio envía al destinatario y probar la entrega desde el dominio publicado. Si el envío falla, se ofrece contacto por WhatsApp.

La ruta `/privacidad` es un borrador visual: debe completarse con la información legal y los canales de contacto definitivos antes de publicar.
# turnero-landing
