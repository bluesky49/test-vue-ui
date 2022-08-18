<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <div class="header-text">
          Clients
        </div>
        <button class="add-client" @click="modalOpen(true, -1, true)">
          New Client
        </button>
      </div>
      <table>
        <tr class="tbl-header">
          <th v-for="(item, index) of header" :key="item" @click="sortKey=item">
            <div>
              <span style="margin-right: 10px">{{ item }}</span>
              <font-awesome-icon v-if="[0,1,2,3].includes(index)"  icon="fa-solid fa-sort" />
            </div>
          </th>
        </tr>
        <tr v-for="(item, index) of sortedClients" :key="index">
          <td>
            {{item.name}}
          </td>
          <td>
            {{item.email}}
          </td>
          <td>
            {{item.phone}}
          </td>
          <td>
            {{displayProviders(item.providers)}}
          </td>
          <td>
            <button class="edit-btn" @click="modalOpen(false, index, true)">
              Edit
            </button>
          </td>
          <td>
            <button class="edit-btn" @click="modalOpen(false, index, false)">
              Delete
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <client-modal
    :show="modalShow"
    @close="modalShow = false"
    :is-added="isAdded"
    :index="index"
    :type="modalType"
  >
  </client-modal>
</template>
<script>
import ClientModal from "./ClientModal.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { faSearch, faSort } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSearch, faSort);
export default {
  name: "ClienList",
  components: {
    ClientModal,
    "font-awesome-icon": FontAwesomeIcon,
  },
  setup() {
    const store = useStore();
		const providers = computed(() => store.state.providers)
    const header = ["Name", "Email", "Phone", "Providers", "", ""];
    const modalShow = ref(false);
    const isAdded = ref(true);
    const modalType = ref(true);
    const index = ref(-1);
		const clients = computed(() => store.state.clients)
    const sortKey = ref('')
    const sortedClients = ref([])

    const modalOpen = (add, ind, type) => {
      modalShow.value = true;
      isAdded.value = add;
      index.value = ind;
      modalType.value = type;
    };

		const displayProviders = (clientProviders) => {
			const clientProvidersIds = clientProviders.map(i => i._id)
			const temp = providers.value.filter(i => clientProvidersIds.includes(i._id)).map(p => p.name)
			return temp.join(",")
		}

    watch(sortKey, () => {
      sortedClients.value = sortedClients.value.sort((i, j) => {
        const sortkey = sortKey.value.toLowerCase()
        if (i[sortkey] > j[sortkey]) {
          return 1
        } 
        if (i[sortkey] < j[sortkey]) {
          return -1
        }
        return 0
      })
    })

    onMounted(() => {
      sortedClients.value = clients.value
    })

    return {
      clients,
      header,
      modalShow,
      isAdded,
      modalType,
      index,
      providers,
      sortKey,
      sortedClients,
      modalOpen,
			displayProviders
    };
  },
};
</script>
<style>
.page {
  height: 100vh;
  align-items: center;
  display: flex;
}
.content {
  max-width: 1280px;
  width: 100%;
  margin: auto;
}
.header {
  background-color: #f0f5f9;
  border: 1px solid #d7dadf;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  align-items: center;
}
.header-text {
  font-size: 20px;
  color: #4d93cf;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.add-client {
  border-radius: 4px;
  border: 1px solid #d7dadf;
  font-size: 16px;
  padding: 10px 15px;
  background-color: #f8f6f7;
  cursor: pointer;
}
.tbl-header {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.05) 0px 8px 32px;
}
th {
  padding: 10px 20px;
  border: 1px solid #d7dadf;
  background: #ebedef;
  font-weight: 700;
  color: #333;
  font-size: 18px;
  cursor: pointer;
}
td {
  padding: 10px 20px;
  border: 1px solid #d7dadf;
}
.edit-btn {
  border: none;
  text-decoration: underline;
  color: #4d93cf;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
}
</style>