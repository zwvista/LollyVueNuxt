<template>
  <v-container>
    <v-text-field label="USERNAME:" class="col-4 form-control" v-model="loginService.item.USERNAME" />
    <v-text-field label="PASSWORD:" type="password" v-model="loginService.item.PASSWORD" />
    <v-btn class="btn btn-primary" @click="login()">Login</v-btn>
  </v-container>
</template>

<script setup lang="ts">
  const loginService = ref(container.resolve(LoginService));
  const loggedIn = useCookie('userid');

  const login = async () => {
    const userid = await loginService.value.login();
    if (userid) {
      loggedIn.value = userid;
      GlobalVars.userid = userid;
      window.location.href = '/';
    }
  };
</script>

<style>
</style>
