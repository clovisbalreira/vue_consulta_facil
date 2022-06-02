<template>
    <button type="submit" class='btn'>{{title}}</button>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Button',
  props: {
    title : {
      type : String,
      required : true
    }
  }
}
</script>