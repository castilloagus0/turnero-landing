# Ordina — Landing SaaS

Landing editorial para Ordina, una plataforma de gestión de turnos, clientes y cobros. Está construida con Astro como renderizador principal y React Islands para las interacciones puntuales.

## Tecnologías

- Astro 7 + Tailwind CSS 4
- React Islands (`IndustriesCarousel`, `FeatureTabs`, `DemoForm`)
- GSAP + ScrollTrigger y Lenis
- Swiper y Lucide

## Desarrollo

El proyecto requiere Node.js `22.23.4` o superior.

```sh
pnpm install
pnpm dev
pnpm build
```

## Formulario de demo

El formulario valida los datos en el navegador, pero no realiza un envío ficticio. Para habilitarlo hay que conectar `src/components/islands/DemoForm.tsx` a un endpoint seguro (por ejemplo, una Astro Action, endpoint API o CRM) y manejar desde allí el estado de éxito/error real.

La ruta `/privacidad` es un borrador visual: debe completarse con la información legal y los canales de contacto definitivos antes de publicar.
# turnero-landing
