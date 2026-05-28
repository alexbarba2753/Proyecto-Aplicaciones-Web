import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
            
            url: '/api',
            description: 'Servidor Actual'
        }
        ],
    },

    apis: [path.join(__dirname, './routers/*.js')], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;