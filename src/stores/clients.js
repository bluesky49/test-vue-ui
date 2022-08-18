import { createStore } from 'vuex'
import { makeRequest } from "../apiRequest"

export const clientStore = createStore({
  state () {
    return {
      clients: [],
      providers: []
    }
  },
  mutations: {
    getClients(state, payload) {
      state.clients = payload
    },
    getProviders(state, payload) {
      state.providers = payload
    },
    addClient(state, payload) {
      state.clients = [...state.clients, payload]
    },
    addProvider(state, payload) {
      state.providers = [...state.providers, payload]
    },
    updateClient(state, payload) {
      state.clients = state.clients.map(i => {
        if (i._id === payload._id) {
          return payload
        } else {
          return i
        }
      })
    },
    updateProvider(state, payload) {
      state.providers = state.providers.map(provider => {
        if (provider._id == payload._id) {
          return payload
        } else {
          return provider
        }
      })
    },
    deleteClient(state, payload) {
      state.clients = state.clients.filter(p => p._id !== payload)
    },
    deleteProvider(state, payload) {
      state.providers = state.providers.filter(p => p._id !== payload)
    },
  },
  actions: {
    getClients(context, data){
      context.commit("getClients", data)
    },
    getProviders(context, data) {
      context.commit("getProviders", data);
    },

    async initClients(context) {
      const clients = await makeRequest("clients", "GET");
      context.commit("getClients", clients);
    },
    async initProviders(context) {
      const providers = await makeRequest("providers", "GET");
      context.commit("getProviders", providers);
    },

    async createClient(context, data) {
      await makeRequest("clients", "POST", data);
      context.commit("addClient", data);
    },
    async createProvider(context, data) {
      const provider = await makeRequest("providers", "POST", data);
      context.commit("addProvider", provider);
    },

    async updateClient(context, data) {
      const client = await makeRequest("clients", "PUT", data);
      context.commit("updateClient", client);
    },
    async updateProvider(context, data) {
      await makeRequest("providers", "PUT", data);
      context.commit("updateProvider", data);
    },

    async deleteClient(context, data) {
      await makeRequest("clients", "DELETE", data);
      context.commit("deleteClient", data);
    },
    async deleteProvider(context, data) {
      await makeRequest("providers", "DELETE", data);
      context.commit("deleteProvider", data);
    },
  }
})