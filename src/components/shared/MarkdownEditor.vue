<template>
  <el-tiptap 
    v-model="content" 
    :extensions="extensions"
    @onTransaction="change"
  />
</template>

<script>
import {
  // necessary extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList
} from 'element-tiptap';

export default {
  name: "MarkdownEditor",
  events: ["save"],
  props: {
    value: {
      type: String,
      value: "",
    },
    mode: {
      type: String,
      value: "full",
    },
    embedded: {
      type: Boolean,
      value: false,
    },
  },
  //  model: {
  //   prop: 'value',
  //   event: 'input'
  // },
  async created() {
    
  },
  async mounted() {
    this.content = this.value;
  },
  components: {
    
  },
  methods: {
    timeout() {
      if (!this.saved) {
        this.save(this.internalValue);
      }
      setTimeout(this.timeout, 10000);
    },
    change(text, html) {
      this.saved = false;
      console.log('change', this.content)
      this.$emit("input", this.content);
    }
  },
  data: () => ({
    saved: true,
    extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold(), // render command-button in bubble menu.
        new Underline(), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList()
      ],
      // editor's content
      content: `
        <h1>Ciao!</h1>
        <p>Scrivi qui la tua ricetta!</p>
      `,
  }),
};
</script>
   