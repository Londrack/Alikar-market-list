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
            if (window.confirm(`¿Realmente quieres eliminar ${this.products[i].idPto} - $${this.formatNum(this.products[i].value)}?`)) {
                this.products.splice(i, 1);
            }
            this.saveItems();
        },
        editItem(i){
            const newVal = window.prompt(`El nuevo precio de ${this.products[i].idPto} es:`,`${this.formatNum(this.products[i].value)}`);
            if (newVal > 0 && newVal !== null){
                this.products[i].value = newVal;
                this.saveItems();
            }
        },
        addPresupuesto(){
            this.presupuesto = document.getElementById("toPresupuesto").value.replace(/[,.]/g, '');
            localStorage.setItem('presupuesto', this.presupuesto);
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