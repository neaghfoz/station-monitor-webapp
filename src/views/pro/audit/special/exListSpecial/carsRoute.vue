<template>
  <div class="app-container">
      <ex-list-special :searchType="searchType">
      </ex-list-special>
  </div>
</template>

<script>
  import ExListSpecial from "@/views/pro/audit/special/exListSpecial/exListSpecial"

  export default {
    name: 'audit.special.exListSpecial.carsRoute', 
    components: {ExListSpecial},
    data() {
      return {
        searchType:'cars',
      }
    },
    created() {
      
    },
    mounted() {
      
    },
    methods: {
       
    }
  }
</script>