<template>
    <span class="material-symbols-outlined">{{icon}}</span>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Icon',
  props: {
    icon : {
      type : String,
      required : true
    }
  }
}
</script>