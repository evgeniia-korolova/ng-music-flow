export default async (request: Request) => {
    const backendUrl = 'https://ng-music-flow.onrender.com'; 
    
    const url = new URL(request.url);
    const originalPath = request.headers.get('x-nf-original-path') || url.pathname;
    const endpoint = originalPath.replace(/^\/api\/auth\//, '').replace(/^\/auth\//, '');
  
    const targetUrl = `${backendUrl}/auth/${endpoint}${url.search}`;
  
    try {
      const options: RequestInit = {
        method: request.method,
        headers: { 'Content-Type': 'application/json' },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
      };
  
      const response = await fetch(targetUrl, options);
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Proxy Error to Render:', error);
      return new Response(JSON.stringify({ error: 'Failed to connect to backend' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
  
  export const config = {
    path: ['/api/auth/*', '/auth/*'],
  };