<template>
  <div>
    <basic-container>欢迎使用</basic-container>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'wel',
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters(['website'])
    },
    methods: {

    }
  }
</script>

<style scoped="scoped" lang="scss">

</style>
