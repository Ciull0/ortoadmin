<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1>Crea il tuo account per salvare le tue piante!</h1>
        <v-form>
          <v-text-field v-model="user.name" type="name" label="Name" />
          <v-text-field v-model="user.username" type="text" label="Username" />
          <v-text-field
            v-model="user.password"
            type="password"
            label="Password"
          />
          <v-btn @click="save" block>Registrati</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  beforeMount: async function () {},
  methods: {
    save: async function (data) {
      let response = await this.apiCall("/api/handler", "POST", this.user, {
        action: "register",
      });

      if (response.status != 200 || response.data.hasError) {
        this.showError("Registrazione Fallita, per favore riprova!");
      } else {
        let user = response.data.data;
        console.log(user);
        this.showSuccess("Ciao  " + user.name + "! Sei uno dei nostri, per favore esegui l'accesso!");
        this.$router.push({ name: "login" });
      }
    },
  },
  data: () => ({
    user: {
      token: "",
      username: "",
      password: "",
      name: "",
    },
  }),
};
</script>
