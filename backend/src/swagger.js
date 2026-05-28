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
            // Reemplaza esto con tu link real de Vercel (el que termina en /api)
            url: 'https://proyecto-aplicaciones-web-chi.vercel.app/api',
            description: 'Servidor de Producción (Vercel)'
        }
        ],
    },
    // Le indicamos a Swagger que busque la documentación en tu carpeta de routers
    apis: ['./src/routers/*.js', './backend/src/routers/*.js', './routers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;