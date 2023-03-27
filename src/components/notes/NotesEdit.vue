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
    <v-card v-if="inited && thereIsNote" flat>
      <v-text-field 
        label="Pianta"
        placeholder="Inserisci il nome della pianta"
        v-model="editing.title" />
      <v-card style="margin-bottom: 1rem">
        <v-card-title>Tempistiche</v-card-title>
        <v-range-slider
          label="Serra"
          :step="1"
          :ticks="true"
          :tick-size="4"
          :thumb-label="true"
          :thumb-size="60"
          :value="[0,11]"
          min="0"
          max="11"
          :model-value="editing.greenhouse_time"
          v-model="editing.greenhouse_time"
          style="margin: 1rem;"
        >
          <template v-slot:thumb-label="modelValue">
            {{season(modelValue.value)}}
          </template>
        </v-range-slider>
        <v-range-slider
          label="Semina"
          :step="1"
          :ticks="true"
          :tick-size="4"
          :thumb-label="true"
          :thumb-size="60"
          :value="[0,11]"
          min="0"
          max="11"
          :model-value="editing.planting_time"
          v-model="editing.planting_time"
          style="margin: 1rem;"
        >
          <template v-slot:thumb-label="modelValue">
            {{season(modelValue.value)}}
          </template>
        </v-range-slider>
        <v-range-slider
          label="Raccolta"
          :step="1"
          :ticks="true"
          :tick-size="4"
          :thumb-label="true"
          :thumb-size="60"
          :value="[0,11]"
          min="0"
          max="11"
          :model-value="editing.harvesting_time"
          v-model="editing.harvesting_time"
          style="margin: 1rem;"
        >
          <template v-slot:thumb-label="modelValue">
            {{season(modelValue.value)}}
          </template>
        </v-range-slider>
      </v-card>
      <v-card style="margin-bottom: 1rem;">
        <v-card-title>Preparazione</v-card-title>
        <MarkdownEditor v-model="editing.planting_instructions" :embedded="true" />
      </v-card>
      <v-card style="margin-bottom: 1rem;">
        <v-card-title>Ricette</v-card-title>
        <MarkdownEditor v-model="editing.cooking_instructions" :embedded="true" />
      </v-card>
      <v-card style="margin-bottom: 1rem;">
        <v-card-title>Note & Appunti</v-card-title>
        <MarkdownEditor v-model="editing.notes" :embedded="true" />
      </v-card>
    </v-card>
    <v-card v-if="inited && !thereIsNote">
      <v-card-title>Ancora Nessuna Pianta</v-card-title>
      <v-card-subtitle>Inserisci la tua prima pianta aprendo il menu laterale</v-card-subtitle>
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
    season (val) {
      return this.seasons[val]
    }
  },

  mounted: async function () {
    let _this = this;
    this.listen("notes:changed", this, async function (sender, data) {
      sender.inited = false;
      _this.inited = true;
      if(data){
        _this.thereIsNote = true;
        sender.editing = (await sender.get("note", data._id)).data;
        sender.load();
      }
    });
  },

  data: () => ({
    editing: {},
    inited: false,
    thereIsNote: false,
    seasons: [
        'Jenuary',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
      ]
  }),
};
</script>
