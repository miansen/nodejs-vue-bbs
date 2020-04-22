<template>
  <div id="app">
    <ClientHeader v-if="isClient" :activeIndex="activeIndex"/>
    <AdminHeader v-else />
    <router-view class="page" v-if="viewShow"/>
  </div>
</template>

<script>
import ClientHeader from '@/components/ClientHeader'
import AdminHeader from '@/components/AdminHeader'

import bus from '@/bus'

export default {
  name: 'App',
  components: { ClientHeader, AdminHeader },
  data () {
    return {
      isClient: true,
      viewShow: true,
      activeIndex: '/'
    }
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  created () {
    bus.$on('login', () => {
      this.isClient = JSON.parse(window.sessionStorage.getItem('isClient') || false)
    })
    this.isClient = JSON.parse(window.sessionStorage.getItem('isClient') || false);
  },
  methods: {
    reload() {
      console.log("reload方法被调用了");
      this.viewShow = false;
      this.$nextTick(() => {
        this.viewShow = true;
      });
    }
  },
  beforeRouteEnter (to, from, next){
    next(vm => {
      vm.activeIndex = to.path
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.activeIndex = to.path
    next()
  }
}
</script>

<style>
html, body, #app, .page {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
