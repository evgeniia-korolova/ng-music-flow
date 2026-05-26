declare global {
  const process: {
    env: Record<string, string | undefined>;
  };
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const originalPath = request.headers.get('x-nf-original-path') || url.pathname;
  // const pathParts = originalPath.split('/').filter(Boolean);
  // const endpoint = pathParts[pathParts.length - 1] || 'tracks';
  const endpoint = originalPath.replace(/^\/api\//, ''); 

  const searchParams = url.searchParams.toString();
  const jamendoId = process.env['JAMENDO_CLIENT_ID'];

  if (!jamendoId) {
    console.log('No key is found');
    
    return new Response(JSON.stringify({ error: 'Jamendo Client ID is missing on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const jamendoUrl = `https://api.jamendo.com/v3.0/${endpoint}/?client_id=${jamendoId}&${searchParams}`;

  try {
    const response = await fetch(jamendoUrl);
    const data = await response.json();
    console.log('endpoint', endpoint);
    console.log('params', searchParams);
    console.log('jamendoUrl', jamendoUrl);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Jamendo API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from Jamendo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/*',
};
