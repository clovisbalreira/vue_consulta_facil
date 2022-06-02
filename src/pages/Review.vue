<template>
  <main>
    <router-link to="/attendance">
      <!-- link page previous -->
      <Arrow /> 
    </router-link>
    <section id="review">
      <h2 class="title_review">Revisão de cadastro</h2>
      <div class="d-flex p-2">
        <div class="d-inline first_div_section">
          <!-- date person-->
          <p class="title">Nome completo</p>
          <p>{{persons.name}}</p>
          <p class="title">CPF</p>
          <p>{{persons.cpf}}</p>
          <p class="title">Número de celular ou telefone</p>
          <p>{{persons.phone}}</p>
          <p class="title">Estado/Cidade</p>
          <p>{{state}} - {{city}}</p>
          <p class="title">Especialidade principal</p>
          <p>{{specialization}}</p>
          <p class="title">Preço consulta</p>
          <p>R$ {{professionals.price}}</p>
          <p class="title">Formas de pagamento de consulta</p>
          <p v-if="money">Dinheiro pagamento a vista</p>
          <p v-if="pix">Pix pagamento a vista</p>
          <p v-if="cart">Cartão de crédito -
            <span>{{professionals.installments}}x sem juros</span>        
          </p>
          <router-link to="/registration">
            <!-- profissional cadastre -->
            <Button title='CADASTRAR PROFISSIONAL' class='btn_cadastre'/>
          </router-link>
          <router-link to="/">
            <div>
              <!-- link edit profissional -->
              <a class="button_edit" src="">Editar cadastro</a>
            </div>
          </router-link>
        </div>
        <div class="d-inline">
          <!--image-->
          <img src='../assets/img/desktop-pagina-3.png' />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
/* import */
import Arrow from "../components/Arrow.vue";
import Button from "../components/Button.vue";
import api from '../services/api.js';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Review',
  components: {
    Arrow,
    Button
  },
  data(){
    return{
      persons: '',
      professionals: '',
      money: false,
      pix: false,
      cart: false,
      state: '',
      city: '',
      specialization: '',
    }
  },
  methods:{
    /* function get person */
    async getPerson(){
      const req = await fetch("http://localhost:3000/personal")
      const data = await req.json()
      this.persons = data
       api.get(`/cidades?id=${this.persons.codCity}`).then(response => {
        this.city = response.data[0].nome
      })
      api.get(`/estados?id=${this.persons.codState}`).then(response => {
      this.state = response.data[0].nome
      })
    },
    /* function get profissional*/
    async getProfissional(){
      const req = await fetch("http://localhost:3000/profissional")
      const data = await req.json()
      this.professionals = data
      this.money = this.professionals.payment.money
      this.pix = this.professionals.payment.pix
      this.cart = this.professionals.payment.cart
      api.get(`/especialidades?id=${this.professionals.specialization}`).then(response => {
        this.specialization = response.data[0].nome
      })
    }
  },
  mounted(){
    this.getPerson()
    this.getProfissional()
  }
}
</script>

<style scoped>
  /* page review */
  /* title review */
  .title_review{
      margin-bottom: 25px;   
  }

  /* title */
  .title{
      font-weight: bolder;
  }

  /* button edit*/
  .button_edit{
      color: var(--primary1);
      font-weight: bolder;
      font-size: 1.5em;
      text-align: center;
      width: 100%;
      padding-top: 20px;
      text-decoration: none;
  }
</style>