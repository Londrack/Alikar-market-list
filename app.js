Vue.component('modal', {
    props:['target'],
    template: /* vue-html */`
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h3><slot name="title"></slot></h3>
            <slot name="content"></slot>
            <button class="saveBtn" @click="$emit('function-modal', target)">Guardar</button>
            <div class="closeBtn" @click="$emit('close-modal')"><i class="color-grey far fa-times-circle" aria-hidden="true"></i></div>
          </div>
        </div>
      </div>`
})

new Vue({
    el: '#app',

    data () {
      return {
          products: [],
          title: '',
          value: '',
          idPto: 0,
          presupuesto: 0,
          handleCompras: false,

          showModal: false,
          titleModal:'',
          contentModal:'',
          functionModal:'saveItems',
          targetModal: '0',

      }
    },

    computed: {
        saldoTotal(){
            let total = 0
            if(this.products.length > 0) {
                this.products.forEach(c => {
                    total += (c.value !== '') && parseInt(c.value);
                });
            }
            total = parseInt(this.presupuesto) - total
            return total
        },
        ptosPendientes(){
            return this.products.filter(function(u) {
                return u.value == 0
            })
        },
        ptosComprados(){
            return this.products.filter(function(u) {
                return u.value > 0
            })
        },
        modalEditItem(){
            return {
                content: `<label class="mr-3">Precio:</label>
                    <input
                        type="number"
                        id="newVal"
                        step="1000"
                    />`,
                fc: 'editItem',
            }
        },
        modalRemoveItem(){
            return {
                content: `<p>¿Realmente deseas eliminar este producto?</p>`,
                fc: 'removeItem',
            }
        },
        modalEditPresupuesto(){
            return {
                content: `<input type="number" id="newVal" />`,
                fc: 'editPresupuesto',
            }
        }
    },

    methods: {
        addItem(){
            this.products.push({title: this.title, value: this.value, idPto: this.idPto});
            this.title = '';
            this.value = '';
            this.idPto += 1;
            this.saveItems();
        },
        saveItems() {
          const parsed = JSON.stringify(this.products);
          localStorage.setItem('products', parsed);
          localStorage.setItem('idPto', this.idPto.toString());
        },
        removeItem(i){
            this.products.splice(i, 1);
            this.saveItems();
            this.toggleModal()
        },
        modalConstructor(modalInfo, title, ptoId =  false){
            const index = (ptoId) ? this.products.map(function(e) { return e.idPto; }).indexOf(ptoId) : '';
            this.targetModal = index;
            this.titleModal = title;
            this.contentModal = modalInfo.content;
            this.functionModal = modalInfo.fc;
            this.toggleModal();
        },
        editItem(i){
            const newVal = document.getElementById("newVal").value;
            if (newVal > 0 && newVal !== null){
                this.products[i].value = newVal;
                this.saveItems();
            }
            this.toggleModal()
            document.getElementById("newVal").value = '';
        },
        addPresupuesto(){
            this.presupuesto = document.getElementById("toPresupuesto").value.replace(/[,.]/g, '');
            localStorage.setItem('presupuesto', this.presupuesto);
        },
        editPresupuesto(){
            // const newVal = window.prompt(`El nuevo presupuesto es:`,`${this.presupuesto}`);
            const newVal = document.getElementById("newVal").value;
            if (newVal > 0 && newVal !== null){
                this.presupuesto = newVal;
                localStorage.setItem('presupuesto', this.presupuesto);
            }
            this.toggleModal();
            document.getElementById("newVal").value = '';

        },
        formatNum(val){
            return new Intl.NumberFormat("es-ES").format(val)
        },
        numberBlur(e){
            e.target.value = this.formatNum(e.target.value)
        },
        numberFocus(e){
            e.target.value = e.target.value.replace(/[,.]/g, '');
        },
        cleanAll(){
            if (window.confirm(`¿Realmente quieres eliminar todos los productos?`)) {
                this.products = [];
                this.idPto = 0;
                localStorage.removeItem('products');
                localStorage.removeItem('idPto');
            }
        },
        toggleModal(){
            this.showModal = !this.showModal;
        }
    },
    mounted() {
        //Productos
        if (localStorage.getItem('products')) {
            try {
                this.products = JSON.parse(localStorage.getItem('products'));
            } catch(e) {
                localStorage.removeItem('products');
            }
        }
        // Presupuesto
        if (localStorage.getItem('presupuesto')) {
            try {
                this.presupuesto = parseInt(localStorage.getItem('presupuesto'));
            } catch(e) {
                localStorage.removeItem('presupuesto');
            }
        }
        //idPto
        if (localStorage.getItem('idPto')) {
            try {
                this.idPto = parseInt(localStorage.getItem('idPto'));
            } catch(e) {
                localStorage.removeItem('idPto');
            }
        }
    },
})