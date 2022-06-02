<template>
  <main>
    <router-link to="/">
      <!-- link page previous -->
      <Arrow />
    </router-link>
    <section id="section_atendimento">
      <h2>Sobre o atendimento</h2>
      <h3>Detalhes do atendimento</h3>
      <form @submit="registerProfissional">
        <div class="d-flex p-2">
          <div class="d-inline first_div_section" >
            <div class="d-inline">
                <!-- select specialization -->
                <label for="especialidade" class="form-label ">Especialidade principal*</label>
                <select v-model="state.specialization" id="especialidade" class="form-select normal select_service" aria-label="Default select example">
                  <option selected>Selecione a especialidade</option>
                  <option v-for="(specialist, index) in experts" :key="index" :value="specialist.id">{{specialist.nome}}</option>
                </select>
                <!-- error select specialization -->
                <p v-if="v$.specialization.$error" class="errorMessage"
                 >{{erroMessage}}</p>
              </div>
            <label for="basic-addon1" class="form-label">Informe o preço da consulta*</label>
            <div class="input-group mb-3 input_price">
              <!-- input price -->
              <span class="input-group-text label_input_consultation_price" id="basic-addon1">R$</span>
              <input v-model.trim="state.price" type="text" class="form-control normal" placeholder="00,00" aria-label="Username" aria-describedby="basic-addon1" id="price" onkeypress="return ( event.charCode >= 48 && event.charCode <= 57 ) || event.charCode == 44 ">
            </div>
            <!-- error input price -->
            <p v-if="v$.price.$error" class="errorMessage">{{erroMessage}} ( os valores tem que ser entre 30 a 350 )</p>
            <!-- select payment methods -->
            <label id="consultaLabel" for="basic-addon1" class="form-label">Formas de pagamento da consulta*</label>
            <div class="div_checkbox">
              <div class="form-check payment_methods_div">
                <label class="form-check-label radio_label_input" for="dinheiro">Em dinheiro
                <input v-model="state.money" class="form-check-input radio_input" type="checkbox" name="tipoPagamento" id="dinheiro" >
                </label>
              </div>
              <div class="form-check payment_methods_div">
                <label class="form-check-label radio_label_input" for="pix"><span  translate="no">Pix</span>
                <input v-model="state.pix" class="form-check-input radio_input" type="checkbox" name="tipoPagamento" id="pix" >
                </label>
              </div>
              <div class="form-check payment_methods_div credit_card_div">
                <label class="form-check-label radio_label_input" for="cartao">Cartão de crédito
                <input v-model="state.cart" v-on:click="openInstallment" class="form-check-input radio_input" type="checkbox" name="tipoPagamento" id="cartao" >
                </label>
                <!-- select installment methods -->
                <article id="installment" class="installment_div" v-if="state.cart">
                  <p>Parcelamento em</p>
                  <div class="form-check">
                    <label class="form-check-label" for="flexRadioDefault1">
                    <input v-model="state.installments" class="form-check-input" type="radio" name="modoPagamento" value="1" id="flexRadioDefault1">
                      1X, sem juros
                    </label>
                  </div>
                  <div class="form-check">
                    <label class="form-check-label" for="flexRadioDefault2">
                    <input v-model="state.installments" class="form-check-input" type="radio" name="modoPagamento" value="2" id="flexRadioDefault2">
                      2X, sem juros
                    </label>
                  </div>
                  <div class="form-check">
                    <label class="form-check-label" for="flexRadioDefault2">
                    <input v-model="state.installments" class="form-check-input" type="radio" name="modoPagamento" value="3" id="flexRadioDefault2">
                      3X, sem juros
                    </label>
                  </div>
                </article>
              </div>
            </div>
            <!-- error select specialization methods -->
            <p v-if="( ( ( v$.specialization.$error && v$.price.$error ) || ( v$.specialization.$error || v$.price.$error ) ) && !v$.money.$model && !v$.pix.$model && !v$.cart.$model )" class="errorMessage">{{erroMessage}}</p>
            <!-- error select installment methods -->
            <p v-if=" ( ( ( v$.specialization.$error && v$.price.$error ) || ( v$.specialization.$error || v$.price.$error ) ) && v$.cart.$model && !v$.installments.$model )" class="errorMessage">{{erroMessage}}</p>
            <!-- status -->
            <div class="status_divider"><span class="status_bar status_bar_size_attendance">&nbsp;</span><span class="status_page">2 de 2</span></div>
              <!-- button page next -->
              <Button
                title='PRÓXIMO'
                class='btn_next'/>
           </div>
          <div class="d-inline">
            <!-- image -->
            <img src='../assets/img/desktop-pagina-2.png' />
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
/* import */
import Arrow from "../components/Arrow.vue";
import Button from "../components/Button.vue";
import api from '../services/api.js';
import useValidate from '@vuelidate/core';
import { required } from "@vuelidate/validators";
import { reactive, computed } from 'vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Attendance',
    components: {
    Arrow,
    Button,
},
setup(){
  const state = reactive({ 
      specialization : '',
      price : '',
      payment : {},
      money : false,
      pix : false,
      cart : false,
      installments : '',
  })
  const rules = computed(() => {
    return {
      specialization : { required },
      price : { required },
      money : { },
      pix : { },
      cart : { },
      installments : { },
    }
  })
  const v$ = useValidate(rules, state)
  return {
    state,
    v$
  }
},
  data(){
    return {
      installment_menu: false,
      experts: [],
      professionals: '',
      containsVirgula : false,
      erroMessage: "Valor requerido"
    }
  }, 
  methods:{
    /* function register profissional */
    async registerProfissional(e){
        e.preventDefault();
        if( this.state.price <= 30 || this.state.price >= 350){
          this.state.price = ''
        }
        this.v$.$validate()
        if(!this.v$.$error && ( this.v$.money.$model || this.v$.pix.$model || ( this.v$.cart.$model && this.v$.installments.$model != '' ) ) ){
          var installment = '0'
          if(this.v$.cart.$model){
            installment = this.state.installments           
          }
          const data ={
            specialization : this.state.specialization,
            price : this.state.price.replace(',','.').replace(',','0')  ,
            payment : {
              money : this.state.money,
              pix : this.state.pix,
              cart : this.state.cart,
            },
            installments : installment,
          }
        const dataJson = JSON.stringify(data)

        const req = await fetch("http://localhost:3000/profissional",{
          method: "POST",
          headers: { "Content-type" : "application/json"},
          body: dataJson
        })
        await req.json()
        this.$router.push('/review')
      }
    },
    /* function get profissional */
    async getProfissional(){
      const req = await fetch("http://localhost:3000/profissional")
      const data = await req.json()
      this.professionals = data
    },
    /* function mask price */
    maskPrice(){
      const priceInput = document.getElementById('price')
      priceInput.addEventListener('keypress',()  => {
        let text = priceInput.value
        let firstVirgula = -1
        let lastVirgula = -1
        /* contain virgula */
        for( var i = 0; i < text.length; i++){
          if( text[i] == ',' ){
            this.containsVirgula = true
            if(firstVirgula == -1){
              firstVirgula = i
            }else{
              lastVirgula = i
            }
          }
        }
        /* print */
        if(this.containsVirgula){
          priceInput.value = ''
          for( var j = 0; j < text.length; j++){
            console.log('ok')
            if( ( firstVirgula != -1 && j == firstVirgula + 2 ) || lastVirgula == j ){
              break
            }
            priceInput.value += text[j]
          }          
        }       
      })
    },

  },
  mounted(){
    this.maskPrice()
    this.getProfissional()
    api.get('/especialidades').then(response => {
      this.experts = response.data;
    });
  }
}
</script>

<style scoped>
  /* page atentimento */
  /* select service */
  .select_service{
      margin-bottom: 20px;
  }

  /* input price */
  .input_price{
      width: 75%;
  }

  /* label input consultation price */
  .label_input_consultation_price{
      background-color: var(--primary1);
      color: var(--secondary0);
  }

  /* credit card  div */
  .credit_card_div{
      width: 80%;
  }

  /* div checkbox */
  .div_checkbox{
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
  }

  /* payment methods div */
  .payment_methods_div{
      background-color: var(--secondary1);
      display: flex;
      width: 100%;
      padding-bottom: 15px;
      margin-bottom: 10px;
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.219);
      border-radius: 5px;
  }

  /* radio input*/
  .radio_input{
      margin-right: 40px;
  }

  /* radio label input*/
  .radio_label_input{
      margin-left: 50px;
  }

  /* credit card div */
  .credit_card_div{
      display: flex;
      flex-direction: column;
  }

  /* installment div */
  .installment_div{
      padding-top: 20px;
      padding-left: 90px;
      /*display: none;*/
  }

  /* status bar size attendance */
  .status_bar_size_attendance{
      width: 370%;
  }

</style>