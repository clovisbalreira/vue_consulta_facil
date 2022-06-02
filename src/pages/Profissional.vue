<template>
  <main>
    <section id="section_profissional">
      <h2>Sobre o profissional</h2>
      <h3>Dados do profissional</h3>
      <form @submit="registerPeople">
        <div class="d-flex p-2">
          <div class="d-inline first_div_section">
            <span class="d-block">
              <!-- input name-->
              <div class="mb-3 first_div_section">
                <label for="name" class="form-label">Nome completo*</label>
                <input v-model.trim="state.name" class="form-control normal" :class="[v$.name.$error ? 'error' : '']" type="text"  id="name" placeholder="Digite o nome completo">
                <!-- error input name -->
                <p v-if="v$.name.$error" class="errorMessage"
                 >{{erroMessage}}</p>
              </div>
            </span>
            <span class="d-block">
              <!-- input cpf -->
              <div class="mb-3 first_div_section">
                <label for="cpf" class="form-label">CPF*</label>
                <input v-model="state.cpf" type="text" class="form-control normal section_input_75" :class="[v$.cpf.$error ? 'error' : '']" id="cpf" placeholder="Digite um CPF" maxLength="14" onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                <p v-if="v$.cpf.$error" class="errorMessage"
                 >{{erroMessage}}</p>
                <!-- error input cpf -->
                <p v-if="errorCpf" class="errorMessage">erro</p>
              </div>
            </span>
            <span class="d-block">
              <!-- input phone-->
              <div class="mb-3 first_div_section">
                <label for="telefone" class="form-label">Número de celular*</label>
                <input v-model="state.phone" type="text" class="form-control normal section_input_75" :class="[v$.phone.$error ? 'error' : '']" id="phone" maxLength="16" onkeypress="return event.charCode >= 48 && event.charCode <= 57" placeholder="(00) 0 0000-0000">
              </div>
              <!-- error input phone -->
              <p v-if="v$.phone.$error" class="errorMessage">{{erroMessage}}</p>
            </span>
            <div>
              <div class="d-inline">
                <!-- select state -->
                <label for="estado" class="form-label">Estado*</label>
                <select v-model="state.codState" v-on:click="getCity" id="estado" class="form-select normal section_input_50" :class="[v$.codState.$error ? 'error' : '']" aria-label="Default select example">
                  <option selected>Selecione</option>
                  <option v-for="(state,index) in states" :key="index" :value="state.id" >{{state.nome}} / {{state.sigla}}</option>
                </select>
                <!-- error select state -->
                <p v-if="v$.codState.$error" class="errorMessage"
                 >{{erroMessage}}</p>
              </div>
              <div class="d-inline">
                <!-- select city-->
                <label for="cidade" class="form-label">Cidade*</label>
                <select v-model="state.codCity" id="cidade" class="form-select normal section_input_50" :class="[v$.codCity.$error ? 'error' : '']" aria-label="Default select example">
                  <option selected>Selecione</option>
                  <option v-for="(city, index) in cities" :key="index" :value="city.id">{{city.nome}}</option>
                </select>
                <!-- error select city -->
                <p v-if="v$.codCity.$error" class="errorMessage"
                 >{{erroMessage}}</p>
              </div>
            </div>
            <!-- status -->
            <div class="status_divider"><span class="status_bar status_bar_size_profission">&nbsp;</span><span class="status_page">1 de 2</span></div>
            <!-- button page next -->
            <Button
              title='PRÓXIMO'
              class='btn_next'/>
          </div>
          <div class="d-inline">
            <!-- image -->
            <img src='../assets/img/desktop-pagina-1.png' />
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
/* import */
import Button from "../components/Button.vue";
import api from '../services/api.js';
import useValidate from '@vuelidate/core';
import { required, minLength, maxLength } from "@vuelidate/validators";
import { reactive, computed } from 'vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Profissional',
  components: {
    Button
},
setup(){
  const state = reactive({ 
    name : "",
    cpf : "",
    phone : "",
    codState : "",
    codCity: "",
  })
  const rules = computed(() => {
    return {
      name : { required, minLength: minLength(3), maxLength: maxLength(48) },
      cpf : { required, minLength: minLength(14), maxLength: maxLength(14)},
      phone : { required, minLength: minLength(16), maxLength: maxLength(16) },
      codState : { required },
      codCity: { required },
    }
  })
  const v$ = useValidate(rules, state)
  return {
    state,
    v$
  }
},
  data(){
    return{
      persons : '',
      professionals : [],
      states : [],
      cities: [],
      errorCpf: false,
      erroMessage: "Valor requerido"
    }
  },
  methods:{
    /* function getCity */
    getCity: function(){
      api.get(`/cidades?estadoId=${this.state.codState}`).then(response => {
        this.cities = response.data;
      })
    },
    /* register people */
    async registerPeople(e){
      e.preventDefault();
      console.log('submit')
      this.v$.$validate()
      if(!this.v$.$error){
        console.log('sucesso')
        const data ={
          name : this.state.name,
          cpf : this.state.cpf,
          phone : this.state.phone,
          codState : this.state.codState,
          codCity: this.state.codCity,
        }

        const dataJson = JSON.stringify(data)

        const req = await fetch("http://localhost:3000/personal",{
          method: "POST",
          headers: { "Content-type" : "application/json"},
          body: dataJson
        })
        await req.json()
        this.$router.push('/attendance')
      }
    },
    /* function getperson */
    async getPerson(){
      const req = await fetch("http://localhost:3000/personal")
      const data = await req.json()
      this.persons = data
    },
    /* mask cpf */
    maskCpf(){
      const cpfInput = document.getElementById('cpf')
        cpfInput.addEventListener('keypress',()  => {
          let InputLength = cpfInput.value.length  
          if(InputLength == 3 || InputLength == 7 ){
            cpfInput.value += '.'
          }else if(InputLength == 11){
            cpfInput.value += '-'
          }
          if(InputLength >= 13){
            api.get('/profissionais').then(response => {
              this.professionals = response.data;
            })
            var cpfVerificar = cpfInput.value.replace(".","").replace(".","").replace("-","")
            console.log(cpfVerificar)
            for(var i = 0; i < this.professionals.length; i++){
              var cpfMedico = this.professionals[i].cpf.slice(0, -1)
                console.log(cpfMedico)
              if(cpfVerificar == cpfMedico){
                cpfInput.setAttribute('class','form-control normal section_input_75 error')
                this.errorCpf = true
                break
              }else{
                cpfInput.setAttribute('class','form-control normal section_input_75')
                this.errorCpf = false
              }
            }
          }
        }
      )
    },
    /* mask phone */
    maskPhone(){
    const phoneInput = document.getElementById('phone')
        phoneInput.addEventListener('keypress',()  => {
          let InputLength = phoneInput.value.length  
          console.log(InputLength)
          if(InputLength == 0){
            phoneInput.value = '(' + phoneInput.value
          }else if(InputLength == 3){
            phoneInput.value += ') '
          }else if(InputLength == 6){
            phoneInput.value += ' '
          }else if(InputLength == 11){
            phoneInput.value += '-'
          }
        }
      )
    }
  },
  mounted(){
    this.maskCpf()
    this.maskPhone()
    this.getPerson()
    api.get('/estados').then(response => {
      this.states = response.data;
    });
  }
}
</script>

<style scoped>
  /* page profissional */
  /* section profissional */
  section#section_profissional div div:nth-child(1) div{ 
      width: 100%;
  }

  /* input 75%*/
  .section_input_75{
      width: 75%;
  }    

  /* select 50%*/
  .section_input_50{
      width: 95%;
  }
  /* status bar size profissional */
  .status_bar_size_profission{
      text-align: right;
      width: 80%;
  }
</style>