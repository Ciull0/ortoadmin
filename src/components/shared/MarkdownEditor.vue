<template>
<div> 
   <v-md-editor v-model="value" height="400px" v-if="mode!='preview'" mode="edit"
        :left-toolbar="toolbar"
        @save="save" 
        @change="change"  
        ref="editor" ></v-md-editor>
       <v-md-preview :text="value" v-if="mode=='preview'"></v-md-preview>
   </div>
</template>

<script>
  
import Vue from 'vue';
import VueMarkdownEditor, {xss, } from '@kangc/v-md-editor';
//import VMdPreviewHtml from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';


import VMdPreview from '@kangc/v-md-editor/lib/preview';


import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

VueMarkdownEditor.use(createTodoListPlugin());

import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';

VueMarkdownEditor.use(createTipPlugin());

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';

VueMarkdownEditor.use(createEmojiPlugin());
// Prism
import Prism from 'prismjs';
// highlight code
import 'prismjs/components/prism-json';

import enUS from '@kangc/v-md-editor/lib/lang/en-US';

VueMarkdownEditor.lang.use('en-US', enUS);


VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});




export default {
    name: 'MarkdownEditor',
    events:['save'],
    props: {
            value: {
                type: String,
                value: ''
            },
            mode: {
                type: String,
                value: 'full'
            },
            embedded: {
                type: Boolean,
                value: false
            }
        },
    //  model: {
    //   prop: 'value',
    //   event: 'input'
    // },
    async created(){
        if(this.mode=='simple'){  
            this.toolbar= "undo redo clear | h bold italic strikethrough quote | ul ol  hr";
        }else{
             this.toolbar= "undo redo clear | h bold italic strikethrough quote | ul ol  hr | link  tip todo-list emoji";
        }

        if(!this.embedded){
            this.toolbar=this.toolbar+" | save";
        }
    },
    async mounted(){      
        
       
    },
    components:{
        'v-md-editor':VueMarkdownEditor,
        'v-md-preview':VMdPreview
        },
    methods:{
      
        timeout(){
            if(!this.saved){
                this.save(this.internalValue);                
            }
             setTimeout(this.timeout, 10000);
        },
        change(text,html){
            this.saved=false;
            this.$emit('input', text)
        },
        save(text,html){
            this.saved=true;
            this.$emit('save',text)
            setTimeout(this.timeout, 10000);
        }
    },
    data: () => ({
      saved: true,
      toolbar:""
    }),
  }
   </script>
   