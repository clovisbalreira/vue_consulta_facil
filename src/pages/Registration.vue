<template>
  <main>
    <section id="registration">
      <h2 class="title_registration">Registro do profissional</h2>
      <div class="d-flex p-2">
        <div class="d-inline first_div_section">
          <!-- table cadastre -->
          <table>
            <thead>
              <tr>
                <td colspan="3">
                  Cadastro      
                </td>
              </tr>
            </thead>
            <tbody>
              <tr><td class="subTitulo" colspan="3">Dados pessoais</td></tr>
              <tr><td><Icon icon="person"/></td><td>Nome</td><td>{{persons.name}}</td></tr>
              <tr><td><Icon icon="badge"/></td><td>CPF</td><td>{{persons.cpf}}</td></tr>
              <tr><td><Icon icon="smartphone"/></td><td>Telefone</td><td>{{persons.phone}}</td></tr>
              <tr><td><Icon icon="house"/></td><td>Cidade</td><td>{{city}}</td></tr>
              <tr><td><Icon icon="apartment"/></td><td>Estado</td><td>{{state}} / {{initials}}</td></tr>
              <tr><td class="subTitulo" colspan="3">Dados profissionais</td></tr>
              <tr><td><Icon icon="medical_information"/></td><td colspan="2">Especialidade</td><td>{{specialization}}</td></tr>
              <tr><td class="subTitulo" colspan="3">Forma de pagamento</td></tr>
              <tr><td><Icon icon="payments"/></td><td>Dinheiro</td><td>R$ {{pay1}}</td></tr>
              <tr><td><Icon icon="monetization_on"/></td><td>Pix</td><td>R$ {{pay1}}</td></tr>
              <tr><td :rowspan="professionals.installments"><Icon icon="credit_card"/></td><td>Cartão de crédito</td><td>R$ {{pay1}}</td></tr>
              <tr v-if="professionals.installments >= 2"><td>2 X</td><td>R$ {{(pay2.toFixed(2))}}</td></tr>
              <tr v-if="professionals.installments == 3"><td>3 X</td><td>R$ {{pay3.toFixed(2)}}</td></tr>
            </tbody>
            <tfoot>
              <tr><td colspan="3"><img src="https://d335luupugsy2.cloudfront.net/cms/files/44808/1556282577/$emvcyhnjks4" alt="facilconsulta"></td></tr>
            </tfoot>
          </table>
        </div>
        <div class="d-inline">
          <!-- image -->
          <img class="imglogos" src='https://play-lh.googleusercontent.com/wo6aknxQcA0V-NE8DMRMzSn50QdjMOHI3DeCFizO07P1KBJNJkfqf_icU2abwPbEpg' />
          <img class="imglogos" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1ep9cdoQic0VFKz0uvrUZLiGNzH8mwhBHQ&usqp=CAU' />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
/* import */
import api from '../services/api.js';
import Icon from '../components/Icon.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Registration',
  components: {
    Icon
},
  data(){
    return{
      persons: '',
      professionals: '',
      money: false,
      pix: false,
      cart: false,
      initials: '',
      state: '',
      city: '',
      specialization: '',
      pay1 : 0,
      pay2 : 0,
      pay3 : 0
    }
  },
  methods:{
    /* function person */
    async getPerson(){
      const req = await fetch("http://localhost:3000/personal")
      const data = await req.json()
      this.persons = data
      api.get(`/cidades?id=${this.persons.codCity}`).then(response => {
        this.city = response.data[0].nome
      })
      api.get(`/estados?id=${this.persons.codState}`).then(response => {
        this.state = response.data[0].nome
        this.initials = response.data[0].sigla
      })
    },
    /* function profissional */
    async getProfissional(){
      const req = await fetch("http://localhost:3000/profissional")
      const data = await req.json()
      this.professionals = data
      this.money = this.professionals.payment.money
      this.pix = this.professionals.payment.pix
      this.cart = this.professionals.payment.cart
      console.log(data.price)
      this.pay1 = data.price,
      this.pay2 = data.price / 2,
      this.pay3 = data.price / 3  
    }
  },
  mounted(){
    this.getPerson()
    this.getProfissional()
  }
}

</script>

<style scoped>
  /* page registration */
  /* title registration */
  .title_registration{
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

  /* table */
  table{
    text-align: center;
    width: 99%;
    margin-left: 1%;
    background-color: var(--information);
    border-radius: 20px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.322);
    margin-bottom: 50px;
  }

  /* caption */
  table thead tr td{
    font-size: 2em;
    font-weight: bolder;
    text-align: center;
    background-color: rgba(128, 128, 128, 0.096);
    width: 100%;
    color: var(--primary1);
    text-shadow: 1px 1px 1px var(--primary-1);
  }

  /* tbody cols */
  table tbody tr td:nth-child(1){
    padding: 5px;
  }
  
  table tbody tr td:nth-child(2), table tbody tr td:nth-child(3){
    width: 49%;
  }

  /* tfoot */
  tfoot tr td img{
    width: 300px;
    padding: 20px;
  }

  /* class subtitulo */
  .subTitulo{
    background-color: var(--warning);
    font-size: 1.5em;
  }

  /* image */
  .imglogos{
    width: 300px;
    background-color: red;
    margin: 10% 20%;
  }
</style>