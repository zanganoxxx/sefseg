var url = "bd/crud.php";

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({ 
    search: '', //para el cuadro de búsqueda de datatables  
    snackbar: false, //para el mensaje del snackbar   
    textSnack: 'texto snackbar', //texto que se ve en el snackbar 
    dialog: false, //para que la ventana de dialogo o modal no aparezca automáticamente      
    //definimos los headers de la datatables  
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'id',
      },
      { text: 'MARCA', value:'marca'},
      { text: 'MODELO', value:'modelo'},
      { text: 'STOCK', value: 'stock'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    moviles: [], //definimos el array moviles
    editedIndex: -1,
    editado: {
      id: '',
      marca: '',
      modelo: '',
      stock: '',
    },
    defaultItem: {
      id: '',
      marca: '',
      modelo: '',
      stock: '',
    },
  }),

  computed: {
    //Dependiendo si es Alta o Edición cambia el título del modal  
    formTitle () {
      //operadores condicionales "condición ? expr1 : expr2"
      // si <condicion> es true, devuelve <expr1>, de lo contrario devuelve <expr2>    
      return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
    },
  },

  watch: {
    dialog (val) {
      val || this.cancelar()
    },
  },

  created () {
      this.listarMoviles()
  },

  methods: {      
     //PROCEDIMIENTOS para el CRUD  
    //Procedimiento Listar moviles  
    listarMoviles:function(){
        axios.post(url, {opcion:4}).then(response =>{
           this.moviles = response.data;       
        });
    },          
    //Procedimiento Alta de moviles.
    altaMovil:function(){
        axios.post(url, {opcion:1, marca:this.marca, modelo:this.modelo,stock:this.stock }).then(response =>{
            this.listarMoviles();
        });        
         this.marca = "",
         this.modelo = "",
         this.stock = 0
    },  
    //Procedimiento EDITAR.
    editarMovil:function(id,marca,modelo,stock){       
       axios.post(url, {opcion:2, id:id, marca:marca, modelo: modelo, stock:stock }).then(response =>{
          this.listarMoviles();           
        });                              
    },    
    //Procedimiento BORRAR.
    borrarMovil:function(id){
        axios.post(url, {opcion:3, id:id}).then(response =>{           
            this.listarMoviles();
            });
    },             
    editar (item) {    
      this.editedIndex = this.moviles.indexOf(item)
      this.editado = Object.assign({}, item)
      this.dialog = true
    },
    borrar (item) { 
      const index = this.moviles.indexOf(item)
      
      console.log(this.moviles[index].id) //capturo el id de la fila seleccionada 
        var r = confirm("¿Está seguro de borrar el registro?");
        if (r == true) {
        this.borrarMovil(this.moviles[index].id)    
        this.snackbar = true
        this.textSnack = 'Se eliminó el registro.'    
        } else {
        this.snackbar = true
        this.textSnack = 'Operación cancelada.'    
        }    
    },
    cancelar () {
      this.dialog = false
      this.editado = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    guardar () {
      if (this.editedIndex > -1) {
          //Guarda en caso de Edición
        this.id=this.editado.id          
        this.marca=this.editado.marca
        this.modelo=this.editado.modelo
        this.stock=this.editado.stock
        this.snackbar = true
        this.textSnack = '¡Actualización Exitosa!'  
        this.editarMovil(this.id,this.marca, this.modelo, this.stock)  
      } else {
          //Guarda el registro en caso de Alta  
          if(this.editado.marca == "" || this.editado.modelo == "" || this.editado.stock == 0){
          this.snackbar = true
          this.textSnack = 'Datos incompletos.'      
        }else{
          this.marca=this.editado.marca
          this.modelo=this.editado.modelo
          this.stock=this.editado.stock          
          this.snackbar = true
          this.textSnack = '¡Alta exitosa!'
          this.altaMovil()
        }       
      }
      this.cancelar()
    },
  },
});