require('colors'); 

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquireMenu, inquirePausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


const main = async() =>{
    console.clear();

    let op = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        //Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
        //console.log(tareas.listadoArr);

    }

    //await inquirePausa();

    do {
        op = await inquireMenu(); 
        
        switch (op) {
            case '1':
                //Crear opcion
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
        
            case '2':
                tareas.listadoCompleto();
                break;

            case '3':
                tareas.listarPendientesCompletadas(true);
                break;
            
            case '4':
                tareas.listarPendientesCompletadas(false);
                break;
            
            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;

            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id !== '0'){
                    const ok = await confirmar('¿Estas seguro?');
                
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }
                
                break;
        }

        guardarDB( tareas.listadoArr );

        await inquirePausa();

    }while (op !== '0');

    
}


main();
