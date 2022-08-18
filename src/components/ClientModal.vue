<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare, faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { ref, watch, computed } from "vue"
import _ from "lodash"
import { useStore } from "vuex";

library.add(faPenToSquare, faTrashCan, faFloppyDisk);
export default {
	name: "ClientModal",
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
	props: {
    show: Boolean,
    isAdded: Boolean,
    index: Number,
		type: Boolean
  },
	emits: ["close"],
	setup(props, ctx) {
    const store = useStore();
		const client = ref({name: "", email: "", phone: "", providers: []})
		const providerIds = ref([])
		const newProvider = ref("")
		const providers = computed(() => store.state.providers)
		const clients = computed(() => store.state.clients)
		const editedProvider = ref("")
		const writable = ref([])

		watch(props, () => {
			if (!props.isAdded) {
				client.value = _.cloneDeep(store.state.clients[props.index])
				providerIds.value = client.value?.providers.map(i => i?._id)
			} else {
				client.value = {name: "", email: "", phone: "", providers: []}
				providerIds.value = []
			}
		})

    const itemCheck = (e, p) => {
			if (e.target.checked) {
				client.value.providers.push(p)
			} else {
				client.value.providers = client.value.providers.filter(i => i._id !== p._id)
      }
    }
		const confirm = async (e) => {
      e.preventDefault();
			if (props.isAdded) {
				await store.dispatch("createClient", JSON.parse(JSON.stringify({...client.value, providers: client.value.providers.map(i => ({_id: i._id}))})))
			} else {
				await store.dispatch("updateClient", JSON.parse(JSON.stringify({...client.value, providers: client.value.providers.map(i => ({_id: i._id}))})))
			}
			ctx.emit("close")
    }
		const deleteClient = async () => {
			await store.dispatch("deleteClient", clients.value[props.index]._id)
			ctx.emit("close")
		}

    const addProvider = async () => {
			await store.dispatch("createProvider", newProvider.value)
    }
    const deleteProvider = async (id) => {
			await store.dispatch("deleteProvider", id)
    }
		const editProvider = (t) => editedProvider.value = t
		const changeProvider = async (_id, index) => {
			await store.dispatch("updateProvider", {_id, name: editedProvider.value})
			writable["value"][index] = false
		} 
		return {
			newProvider,
			editedProvider,
			providers,
			writable,
			client,
			providerIds,
			itemCheck,
			confirm,
			deleteClient,
			addProvider,
			deleteProvider,
			editProvider,
			changeProvider
		}
	}
};
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <form class="modal-container" @submit="confirm" v-if="type">
          <div class="modal-header">
            <div class="modal-header-text">
              {{ isAdded ? "New" : "Edit" }} Client
            </div>
          </div>
          <div class="modal-body">
            <div class="form">
              <div class="labels">
                <div class="label">Name:</div>
                <div class="label">Email:</div>
                <div class="label">Phone:</div>
                <div class="label">Providers:</div>
              </div>
              <div class="forms">
                <input
                  class="input"
                  required
                  v-model="client.name"
                />
                <input
                  class="input"
                  required
                  v-model="client.email"
                />
                <input
                  class="input"
                  type="tel"
                  required
                  v-model="client.phone"
                />
                <div class="provider">
                  <input class="input" v-model="newProvider" />
                  <div class="button" @click="addProvider">Add Provider</div>
                </div>
                <div class="providers">
                  <div
                    v-for="(item, index) of providers"
                    :key="item.name"
                    class="item"
                  >
                    <input
                      type="checkbox"
                      :checked="providerIds.includes(item._id)"
                      @change="(e) => itemCheck(e, item)"
                    />
                    <input
                      :value="item.name"
                      class="provider-name"
                      :readonly="!writable[index]"
                      @change="(e) => editProvider(e.target.value)"
                      :style="{ borderWidth: writable[index] ? '1px' : 0 }"
                    />
                    <div class="icon-button" @click="writable[index] = true" v-if="!writable[index]">
                      <font-awesome-icon  icon="fa-solid fa-pen-to-square" />
                    </div>
                    <div class="icon-button" v-else @click="changeProvider(item._id, index)">
											<font-awesome-icon icon="fa-solid fa-floppy-disk" />
                    </div>
                    <div class="icon-button" @click="deleteProvider(item._id)">
                      <font-awesome-icon icon="fa-solid fa-trash-can" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div>
              <div
                v-if="!isAdded"
                class="button delete-btn"
                @click="deleteClient"
              >
                Delete Client
              </div>
            </div>
            <div class="buttons">
              <div class="button" @click="$emit('close')">Cancel</div>
              <button class="button" type="submit">
                {{ isAdded ? "Add" : "Save" }} Client
              </button>
            </div>
          </div>
        </form>
				<div class="modal-container" v-else>
					<div class="modal-header">
						Are you sure to delete this client?
					</div>
					<div class="modal-footer">
						<div class="buttons">
              <button class="button" @click="$emit('close')">Cancel</button>
              <button class="button" @click="deleteClient">
								Confirm
              </button>
            </div>
					</div>
				</div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border: 1px solid #d7dadf;
}

.modal-header-text {
  font-size: 20px;
  color: #4d93cf;
  font-weight: bold;
}

.modal-header {
  border-bottom: 1px solid #d7dadf;
  display: flex;
  padding: 10px 20px;
  width: 100%;
  align-items: center;
}
.modal-body {
  padding: 20px;
}
.form {
  display: flex;
  justify-content: center;
}
.labels {
  margin-right: 10px;
}
.label {
  font-weight: 700;
  height: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.provider {
  display: flex;
}
.providers {
  border: 1px solid #d7dadf;
  margin-top: 10px;
  padding: 8px 20px;
  border-radius: 4px;
}
.provider-name {
  margin: 0 10px;
  width: 80px;
  border-color: #d7dadf;
  border-width: 0;
  outline: none;
}
.forms {
  width: 300px;
}
.input {
  border-radius: 4px;
  height: 30px;
  display: block;
  margin-bottom: 10px;
  border: 1px solid #d7dadf;
  outline: none;
  padding: 0 10px;
  width: 100%;
  flex: 1;
}
.buttons {
  display: flex;
}
.provider .input {
  margin-bottom: 0;
}
.item {
  display: flex;
  align-items: center;
}
.icon-button {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0 5px;
}
.modal-footer {
  border-top: 1px solid #d7dadf;
  display: flex;
  padding: 10px 20px;
  width: 100%;
  justify-content: space-between;
}
.providers {
  width: 190px;
}
.button {
  width: 100px;
  border-radius: 4px;
  border: 1px solid #d7dadf;
  background-color: #f3f1f1;
  margin-left: 10px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-enter-from {
  opacity: 0;
}
.delete-btn {
  background-color: red;
  color: white;
}
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>