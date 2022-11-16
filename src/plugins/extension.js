import Vue from 'vue';
const EventBus= new Vue();
const url='/api/handler';
Vue.mixin({
    methods: {
      isAuthenticated: function () {
        return localStorage.getItem('userToken')!=null;
      },
      showError:function (message){
        EventBus.$emit("snackbar:push",{ type: 'error', message: message, timeout:60000});
      },
      showSuccess: function(message){
        EventBus.$emit("snackbar:push",{ type: 'success', message: message, timeout:2000});
      },
      showSaving: function(message){
        EventBus.$emit("snackbar:push",{ type: 'saving', message: message, timeout: 60000});
      },
      listen: function (event,sender,func){
        EventBus.$on(event, function(data){
          return func(sender, data);
        })
      },
      send: function (event,data){
        EventBus.$emit(event,data);
      },
      simplifyResponse:   function(response){
        if(response.status==200){
          return response.data;
        }
        
        return {
          hasError: false,
          errorMessage: "error" +response.status
        };
      },
      insertOrUpdate: async function(entity, data)
      {
        let id=data._id && data._id!='';
        delete data._meta;
        if(id)
        {
          return this.simplifyResponse( await this.apiCall(url,'PUT',data,{collection: entity}));
        }
        else 
        {
          return  this.simplifyResponse(  await this.apiCall(url,'POST',data,{collection: entity}));
        }
      },
      patch:  async function (entity, data){
        delete data._meta;
        return  this.simplifyResponse(  await this.apiCall(url,'PATCH',data,{collection: entity}));
  
      },
      remove:  async function (entity, data){
        
        return  (await this.apiCall(url,'DELETE',params,{id: data._id,collection: entity})).status==200;
  
      },
      get:  async function (entity, id){
        
        return  this.simplifyResponse(await this.apiCall(url,'GET',null,{collection: entity, id:id}));
      },
      search:  async function (entity, filter, projection){
        return  this.simplifyResponse(await this.apiCall(url,'GET',null,
         {collection: entity, 
          query: JSON.stringify(filter)??'{}',
          projection: JSON.stringify(projection)??'{}'
        }));
      },
      aggregate:  async function (entity, filter){
        return  this.simplifyResponse(await this.apiCall(url,'GET',null,
              {collection: entity, 
               query: {}, 
               aggregate:JSON.stringify(filter??'{}'),
               projection: {}
              }));
      },
      apiCall:  async function(url,method, body, query){
        let options = {
          url: url,
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          data: body,
          params:query
        };
  
        const response = await this.axios(options);
        return response;
      }
      
    },
  });

export default EventBus;