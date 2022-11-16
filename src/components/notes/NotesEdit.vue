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
            style="z-index:5;bottom:34px;"
          >
            <v-icon>mdi-content-save</v-icon>
          </v-btn>

 <v-skeleton-loader type="list-item-two-line,list-item-two-line,list-item-two-line"  v-if="!inited"/>
     <v-card v-if="inited" flat>
       <v-text-field v-model="editing.title" />
       <MarkdownEditor  @save="save" v-model="editing.text"  :embedded="true" />
     </v-card>
    </v-container>
</template>

<script>
import MarkdownEditor from '../shared/MarkdownEditor.vue';
  export default {
  name: 'NotesDiary',
  components:{
      'MarkdownEditor':MarkdownEditor,
    },
   methods:{
    removeTag (item) {
        this.editing.tags.splice(this.editing.tags.indexOf(item), 1);
        this.editing.tags.__ob__.dep.notify();
      },
    save: async function(){
       this.showSuccess("Saving note");
       let created=this.insertOrUpdate('note',this.editing);
        if(!created.hasError){
        this.showSuccess("competed!");
        this.send("notes:edited", created);
      }
      else{
        this.showError(created.error);
      }
       
    },   
    load: async function(){
      
  
      this.inited=true;
    }
    
   },
  
   mounted:async function(){

    this.listen('notes:changed',this,async function(sender,data){
      console.log("received",data);
      sender.inited=false;
      sender.editing=(await sender.get('note',data._id)).data;
      sender.load();
    });
   },

    data: () => ({
      editing:{},
      inited:false,
      tags: ['Streaming', 'Eating'],
    }),
  }
</script>
