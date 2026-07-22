import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"


const usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true,
        maxlength: 15
    },
    apellido:{
        type:String,
        required:true,
        trim:true,
        maxlength: 15
    },
    direccion:{
        type:String,
        trim:true,
        maxlength: 40,
        default:null
    },
    celular:{
        type:String,
        trim:true,
        default:null
    },
    email:{
        type:String,
        required:true,
        trim:true,
		unique:true
    },
    password:{
        type:String,
        required: function() {
            return this.authProvider === 'local';
        },
        default:null
    },

    // ═══════════════════════════════════════════════════════
    // CAMPOS NUEVOS — Sprint 3: APIs Externas
    // ═══════════════════════════════════════════════════════

    // Cédula ecuatoriana (obligatoria solo en registro local)
    cedula:{
        type:String,
        trim:true,
        unique:true,
        sparse:true      // Permite múltiples documentos sin este campo (usuarios Google)
    },

    // URL de la foto de perfil alojada en Cloudinary
    // Ejemplo: "https://res.cloudinary.com/tu-cloud/image/upload/v123/avatares_esfot/avatar_abc123.png"
    perfil:{
        type:String,
        default:null
    },

    // ID único de Google para usuarios que se autentican con OAuth
    googleId:{
        type:String,
        unique:true,
        sparse:true       // Permite múltiples documentos sin este campo (usuarios locales)
    },

    // Indica cómo se registró el usuario: 'local' (email/password) o 'google' (OAuth)
    authProvider:{
        type:String,
        enum:['local', 'google'],
        default:'local'
    },

    // ═══════════════════════════════════════════════════════
    // CAMPOS EXISTENTES (Sprint 1 y 2)
    // ═══════════════════════════════════════════════════════

    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        default:"estudiante"
    }

},{
    timestamps:true
})





// Método para cifrar el password
usuarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password es el mismo de la BDD
usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
usuarioSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}


export default model('Usuario',usuarioSchema)