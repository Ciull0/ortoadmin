<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
       <h1>login</h1>
       <v-form>
        <v-text-field v-model="username" type="text" label="login" />
        <v-text-field v-model="password" type="password" label="Password"/>
        <v-btn @click="save" block >Save</v-btn>
       </v-form>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col>
       <v-subheader> Not an user? <a href="#" @click="$router.push({name:'register'})">Register</a></v-subheader>
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
            let response=await this.apiCall('/api/handler','POST',{username:this.username, password:this.password},{ action:"login"});
            
            if(response.status !=200 || response.data.hasError)
            {
              this.showError("login failed");
            }
            else
            { 
              let user=response.data.data;
              this.showSuccess("Hello "+user.name);
              localStorage.setItem('userToken',user.token);
              this.$router.push({name:'notes'});
            }
        }
    },
     data: () => ({
      token:"",
      username:"",
      password:"",
      })
  }
</script>
