import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
        title: 'API de Sistema de Prácticas',
        version: '1.0.0',
        description: 'Documentación oficial de los endpoints en producción',
        },
        servers: [
        {
            
            url: 'https://proyecto-aplicaciones-web-chi.vercel.app/api',
            description: 'Servidor de Producción (Vercel)'
        }
        ],
    },
    // Al usar './routers/*.js', Swagger buscará exactamente la carpeta local routers/ que tienes junto a server.js
    apis: ['./routers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;