<script>
import ClientList from "./components/ClientList.vue"
import { ref, onMounted} from "vue"
import { useStore } from 'vuex'

export default {
  name: "App",
  components: {
    ClientList
  },
  setup() {
    const store = useStore()

    const loading = ref(false)

    const init = async () => {
      loading.value = true
      await store.dispatch("initClients")
      await store.dispatch("initProviders")
      loading.value = false
    }

    onMounted(() => {
      init() 
    })

    return {
      loading
    }

  }
}

</script>

<template>
  <main>
    <ClientList v-if="!loading" />
  </main>
</template>
