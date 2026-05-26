declare global {
  const process: {
    env: { [key: string]: string | undefined };
  };
}

export default async (request: Request) => {    
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();  
    
    const jamendoId = process.env['JAMENDO_CLIENT_ID'];
  
    if (!jamendoId) {
      return new Response(JSON.stringify({ error: 'Jamendo Client ID is missing on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }  
    
    const jamendoUrl = `https://jamendo.com{jamendoId}&${searchParams}`;
    
    try {
      const response = await fetch(jamendoUrl);
      const data = await response.json();  
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Jamendo API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch data from Jamendo' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  // Настройка пути: теперь функция будет доступна по адресу /api/music
export const config = {
    path: "/api/music"
  };