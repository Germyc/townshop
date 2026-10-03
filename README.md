# Townshop

Catálogo de landings de demo para comercios locales. Sitio estático desplegado en [Vercel](https://townshop-one.vercel.app).

## Estructura

| Archivo | Descripción |
| :-- | :-- |
| `index.html` | Explorador que detecta y muestra todas las landings disponibles. |
| `landing1/` … `landing6/` | Landings de ejemplo (petshop, panadería, gourmet, etc.). |
| `landing-demos/landing-1/` | Demo: catálogo que consulta (Almacén Doña Rosa). |
| `landing-demos/landing-2/` | Demo: presencia local (Panadería El Maná). |
| `landing-demos/landing-3/` | Demo: tienda online (Almacén Doña Rosa). |
| `codigos-qr.html` | Generador de códigos QR para cada landing. |
| `generador-qr.html` | Generador de códigos QR (variante). |
| `landing6/` | Variante con catálogo dinámico (Firebase) y panel de administración (`admin.html`). |
| `REPORTE.md` | Reporte de sesión para continuidad desde otra terminal/agent. |
| `favicon.svg` | Icono del sitio. |

## Desarrollo

No hay build: son HTML/CSS/JS estáticos. Para servir en local:

```bash
npx serve .
# o
python3 -m http.server 8000
```

## Despliegue

Repositorio: `https://github.com/Germyc/townshop`. Vercel despliega `main` automáticamente.

## Notas

- Las landings nuevas se detectan solas: el explorador busca `landing{N}/index.html` y `landing-demos/landing-{N}/index.html` y corta en el primer 404 de cada patrón.
- Número de WhatsApp de ejemplo: se configura por landing (ver constante en cada archivo).

## Licencia

Todos los derechos reservados. © 2026 Germán Cortez. No se otorga licencia de uso, copia ni redistribución.
