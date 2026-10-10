# Guardado privado en Netlify

Este tablero ahora usa Netlify Functions + Netlify Blobs para guardar la informacion en la nube detras de un login.

## 1. Subir estos archivos a Netlify

Subi la carpeta completa, no solo el HTML:

- `Junta_Asuncion_Tablero.html`
- `package.json`
- `netlify.toml`
- `netlify/functions/auth.mjs`
- `netlify/functions/state.mjs`
- `netlify/functions/_auth.mjs`

Netlify instala `@netlify/blobs` automaticamente desde `package.json`.

## 2. Variables de entorno

En Netlify:

1. Abri tu sitio.
2. Entra a **Site configuration**.
3. Entra a **Environment variables**.
4. Agrega estas 3 variables:

```text
PRIVATE_USER_EMAIL=tu-email@dominio.com
PRIVATE_USER_PASSWORD=una-clave-larga-y-privada
AUTH_SECRET=otra-frase-larga-distinta-para-firmar-token
```

La clave y el secreto no van en el HTML. Quedan guardados en Netlify.

## 3. Deploy

Hace deploy despues de cargar esas variables.

Al abrir la pagina publicada, vas a ver una pantalla de acceso. La informacion se guarda por el email configurado y se vuelve a cargar cada vez que entras con ese usuario.

## 4. Importar datos viejos

Si ya tenias datos en tu navegador:

1. Entra con el usuario privado.
2. Usa **Importar** y carga tu respaldo JSON.
3. Al importar, el tablero lo guarda automaticamente en Netlify.

## 5. Seguridad practica

- No publiques un HTML exportado con datos privados si no queres compartirlos.
- Usa una clave larga.
- Si cambias `PRIVATE_USER_PASSWORD` o `AUTH_SECRET`, cerra sesion y volve a entrar.
- El boton **Cerrar sesion** borra el acceso guardado en ese navegador.
