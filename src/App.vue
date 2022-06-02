<template>
  <div id="app">
    <router-view path="router.key"/>
  </div>
</template>

<script>
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/global.css'

export default {
  name: 'App',
  data(){
    return{
      personalData : {},
      profissionalData : {}
    }
  }
}
</script>