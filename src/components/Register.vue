<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
       <h1>Register</h1>
       <v-form>
        <v-text-field v-model="user.name" type="name" label="Name" />
        <v-text-field v-model="user.username" type="text" label="Username" />        
        <v-text-field v-model="user.password" type="password" label="Password"/>
        <v-btn @click="save" block >Save</v-btn>
       </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Login',
    beforeMount:async function(){
       
    },
    methods:{
        save: async function(data){
            let response=await this.apiCall('/api/handler','POST',this.user,{ action:"register"});
            
            if(response.status !=200 || response.data.hasError)
            {
              this.showError("Registration failed");
            }
            else
            { 
              let user=response.data.data;
              console.log(user);
              this.showSuccess("User registered  "+user.name+ " please login");
              this.$router.push({name:'login'});
            }
        }
    },
     data: () => ({
      user: {
      token:"",
      username:"",
      password:"",
      name:"",
      }
      })
  }
</script>
