<template>
  <v-container>
    <v-btn
      color="secondary"
      elevation="4"
      v-if="inited"
      fab
      absolute
      top
      right
      @click="add"
      style="z-index: 5; bottom: 34px"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader
          type="list-item-two-line,list-item-two-line,list-item-two-line"
          v-if="!inited"
        />

        <v-list tile v-if="inited">
          <v-list-item outlined v-for="note in notes" :key="note._id" @click="change(note)">
            <v-list-item-content class="text-left">
              <v-list-item-title v-text="note.title"></v-list-item-title>
              <v-list-item-subtitle v-text="note.subtitle"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NotesList",

  data: () => ({
    inited: false,
    notes: [],
  }),
  methods: {
    add: async function (item) {
      var d = new Date();
      var datestring =
        ("0" + d.getDate()).slice(-2) +
        "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear() +
        " " +
        ("0" + d.getHours()).slice(-2) +
        ":" +
        ("0" + d.getMinutes()).slice(-2);
      let newNote = {
        title: "note " + datestring,
        text: "",
        deleted: false,
      };
      this.showSaving("note saving");
      let created = await this.insertOrUpdate("note", newNote);
      if (!this.hasError) {
        console.log(created.data);
        this.notes.push(created.data);
        this.change(this.notes[this.notes.length - 1]);
        this.showSuccess("note added");
      }
    },
    change: async function (note) {
      this.send("notes:changed", note);
    },
    load: async function () {
      this.inited = false;

      this.notes = [];
      let result = await this.search("note", this.query, { text: 0 });
      if (!result.hasError) {
        result.data.forEach((element) => {
          this.notes.push(element);
        });
      }
      this.send("notes:changed", this.notes[0]);
      this.inited = true;
    },
  },
  mounted: async function () {
    this.listen("notes:edited", this, async function (sender, data) {
      console.log("edited");
      if (sender.notes.length > 0) {
        let idx = sender.notes.findIndex((x) => (x._id = data._id));
        if (idx >= 0) {
          sender.notes[idx].title = data.title;
        }
      }
    });

    this.load();
  },
};
</script>
