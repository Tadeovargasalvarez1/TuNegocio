// El APK (60 MB) supera el límite de 25 MB por archivo de Cloudflare Pages: esta función lo trae
// del servidor de SCSmartbo y lo entrega desde scsmartbo.pages.dev, así el cliente descarga de la página.
const ORIGEN = 'https://scsmartbo.tail816e9a.ts.net:8443/descargas/TuNegocio-Movil.apk';

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
  const upstream = await fetch(ORIGEN, { method: request.method, cf: { cacheTtl: 300, cacheEverything: true } });
  if (!upstream.ok) {
    return new Response('La descarga no está disponible en este momento. Intenta de nuevo en unos minutos.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  const headers = new Headers({
    'content-type': 'application/vnd.android.package-archive',
    'content-disposition': 'attachment; filename="TuNegocio-Movil.apk"',
    'cache-control': 'public, max-age=300',
  });
  const length = upstream.headers.get('content-length');
  if (length) headers.set('content-length', length);
  return new Response(request.method === 'HEAD' ? null : upstream.body, { status: 200, headers });
}
