import {v4 as uuidv4} from 'uuid';
import path from 'path'
import {promises as fs } from 'fs';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const subirArchivo=async(
    files,
    extensionesValidas =['jpeg','jpg','png','gif'],
    carpetaDestino='uploads',
    prefijo='doc'   
)=>{
    //valido
    if(!files?.archivo)throw new Error('No se proporciono ningun archivo');
    const {archivo}=files;
    //limpio el nombre y la extension para evitar ataques 
    const nombreLimpio = archivo.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const extension = path.extname(nombreLimpio).slice(1).toLowerCase();
    //validacion de extensión
    if(!extensionesValidas.includes(extension)){
        throw new Error(`Extension no permitida:${extension}.solo:[${extensionesValidas}]`);
    }
    //validamos el tamaño de la imagen 10mb maximo
    const tamañoMaximoMB=10;
    if(archivo.size>tamañoMaximoMB*1024*1024){
        throw new Error (`El archivo excede los ${tamañoMaximoMB}MB`);
    }
    //generamos una ruta segura
    const nombreTemp=`${prefijo}_${uuidv4()}.${extension}`;
    const rutaBase=path.resolve(__dirname,'..',carpetaDestino);
    const uploadPath=path.join(rutaBase,nombreTemp);
    //SEGURIDAD ADICIONAL
    if(!uploadPath.startsWith(rutaBase)){
        throw new Error('intento de acceso a ruta no permitida');
    }
    //creo carpeta y de movimiento del archivo
    try{
        await fs.mkdir(rutaBase,{recursive:true});
        await fs.rename(archivo.tempFilePath,uploadPath);
        return nombreTemp;
    }catch(err){
        await fs.unlink(uploadPath).catch(()=>{});//limpio en caso de error
        throw new Error(`Error al subir los archivos: ${err.message}`);
    }
};
export default subirArchivo;
