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
      @click="save"
      style="z-index: 5; bottom: 34px"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>

    <v-skeleton-loader
      type="list-item-two-line,list-item-two-line,list-item-two-line"
      v-if="!inited"
    />
    <v-card v-if="inited" flat>
      <v-text-field 
        label="Pianta"
        placeholder="Inserisci il nome della pianta"
        v-model="editing.title" />
      <v-range-slider
        label="Seminatura"
        :step="1"
        min="0"
        max="11"
        :ticks="seasons"
        :model-value="[0, 1]"
        show-ticks="always"
        thumb-label="always"
        tick-size="4"
        v-model="editing.planting_time"
       >
        <template v-slot:thumb-label="{ modelValue }">
          <span>{{ getSeason(modelValue) }}</span>
        </template>
      </v-range-slider>
      <MarkdownEditor @save="save" v-model="editing.text" :embedded="true" />
    </v-card>
  </v-container>
</template>

<script>
import MarkdownEditor from "../shared/MarkdownEditor.vue";
export default {
  name: "NotesDiary",
  components: {
    MarkdownEditor: MarkdownEditor,
  },
  methods: {
    removeTag(item) {
      this.editing.tags.splice(this.editing.tags.indexOf(item), 1);
      this.editing.tags.__ob__.dep.notify();
    },
    save: async function () {
      console.log('aaaaaaaaaaaaa')
      this.showSuccess("Saving note");
      let created = this.insertOrUpdate("note", this.editing);
      if (!created.hasError) {
        this.showSuccess("competed!");
        this.send("notes:edited", created);
      } else {
        this.showError(created.error);
      }
    },
    load: async function () {
      this.inited = true;
    },
    getSeason: function (value){
      console.log(value);
      return this.seasons[value]
    }
  },

  mounted: async function () {
    this.listen("notes:changed", this, async function (sender, data) {
      console.log("received", data);
      sender.inited = false;
      sender.editing = (await sender.get("note", data._id)).data;
      sender.load();
    });
  },

  data: () => ({
    editing: {},
    inited: false,
    seasons: {
        0: 'Jenuary',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'Settembre',
        9: 'Ottobre',
        10: 'Novembre',
        11: 'Dicembre'
      }
  }),
};
</script>
