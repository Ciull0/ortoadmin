<template>
  <v-app>
    <v-app-bar app dark color="blue-gray">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute left temporary width="80%">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Piante </v-list-item-title>
          <v-list-item-subtitle> Il tuo diario agricolo </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-container>
        <v-row>
          <v-col cols="12"> </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card elevation="0">
              <router-view name="left"></router-view>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-footer padless absolute top="-1px">
        <v-col class="text-center" cols="12">
          <a @click.prevent="logout" href="#">Logout</a>
        </v-col>
        <v-col
          class="text-center caption"
          style="ax-height: 21px; margin: 0px; padding: 0px; background: #eee"
          cols="12"
        >
          {{ version }}
        </v-col>
      </v-footer>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-snackbar
      v-model="snackbar.open"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar.open = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    version: "unassigned",
    snackbar: {
      color: "primary",
      open: false,
      text: "My timeout is set to 2000.",
      timeout: 2000,
      color: "blue-grey",
    },
    drawer: false,
    currentModule: {},
    modules: [],
  }),
  mounted: function () {
    this.modules = this.$router.options.routes.filter((x) => x.menu);
    let index = Math.max(
      this.modules.findIndex((x) => x.name == this.$route.name, this),
      0
    );
    this.currentModule = this.modules[index];
    if (!this.currentModule.closable) {
      this.drawer = !this.currentModule.closable;
    }

    this.version =
      process.env.VUE_APP_VERSION + "  " + process.env.VUE_APP_COMMITMESSAGE; //'v' +( process.env.VERCEL_GIT_COMMIT_REF ?? '??') +'.'+  (process.env.VERCEL_GIT_COMMIT_MESSAGE ?? '??');

    this.listen("menu:updated", this, function (sender, data) {
      sender.drawer = data;
    });
    this.listen("snackbar:push", this, function (sender, data) {
      sender.snackbar.text = data.message;

      sender.snackbar.color = "primary";
      if (data.type == "success") {
        sender.snackbar.color = "success";
      } else if (data.type == "error") {
        sender.snackbar.color = "red accent-2";
      } else if (data.type == "saving") {
        sender.snackbar.color = "primary";
      }
      sender.snackbar.timeout = data.timeout ?? 2000;
      sender.snackbar.open = true;
      console.log(data);
    });
  },
  components: {},
  computed: {
    title() {
      return this.$route.params.title ?? this.currentModule.label;
    },
  },
  methods: {
    logout: async function (item) {
      localStorage.removeItem("userToken");
      this.$router.push({ name: "login" });
    },
    moduleChanged: async function (item) {
      if (this.currentModule.name != this.$route.name) {
        this.$router.push({
          name: this.currentModule.name,
          params: { title: this.currentModule.label },
        });
        this.drawer = !item.closable;
      }
    },
  },
};
</script>
