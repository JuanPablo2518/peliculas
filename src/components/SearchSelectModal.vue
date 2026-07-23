<template>
      <div class="modal-content w-75 mx-auto">
        <div class="modal-header d-block  ">
            <div class="d-flex justify-content-between align-items-center  ">
                <p class="mb-0">Seleccionar Actor</p>
                <div>
                  <a class="color-yellow me-4 ">+ Agregar Nuevo</a>
                  <button class="button-close py-2 px-3 rounded-3 text-white">
                    <font-awesome-icon icon="fa-solid fa-x responsive-icon" />
                  </button>
                </div>
            </div>
          <input type="text" class="form-control" placeholder="Ingerse ..." v-model="inputSelection">
        </div>
        <div class="modal-body p-0 overflow-y ">
        <div class="header-bar p-3">
            <p class="mb-0">Seleccionados</p>
        </div>
          <div v-for="value in selectedValues" :key="value.id" class="d-flex justify-content-between align-items-center p-3  " :class="selectedValues.some(item => item.id === value.id) ? 'selected' : ''" @click="addValue(value.id, value)">
            <div class="d-flex gap-3 align-items-center">
                <img v-if="props.type === 'actor'" :src="value.photo ?  value.photo : actorPlaceholder" class="item-img rounded-4">
            <div class="">
                <p class="mb-1">{{value.title}}</p>
                <p class="mb-0 subtitle"> {{ value.subtitle }}</p>
            </div>
            </div>
                <input class="form-check-input selected-checkbox p-3 rounded-circle" type="checkbox" id="checkNativeSwitch" switch :checked="true" /> 
          </div> 
          <div class="header-bar p-3">
            <p class="mb-0">Disponibles</p>
        </div>
          <div v-for="value in filteredData" :key="value.id" class="d-flex justify-content-between align-items-center p-3 rounded-2 " :class="selectedValues.some(item => item.id === value.id) ? 'selected' : ''" @click="addValue(value.id, value)">
            <div class="d-flex gap-3 align-items-center">
                <img v-if="props.type === 'actor'" :src="value.photo ?  value.photo : actorPlaceholder
                " class="item-img rounded-4">
            <div class="">
                <p class="mb-1">{{value.title}}</p>
                <p class="mb-0 subtitle">  {{ value.subtitle }}</p>
            </div>
            </div>
                <input class="form-check-input selected-checkbox p-3 rounded-circle" type="checkbox" id="checkNativeSwitch" switch :checked="false" /> 
          </div> 
          <div class="text-center py-5" v-if="filteredData.length === 0 && selectedValues.length === 0">
            <p>Sin resultados</p>
          </div>         
        </div>
        
        <div class="modal-footer justify-content-between">
          <p>{{ selectedValues.length }} Seleccionados</p>

          <div >
            <button @click="submitValues" class="btn btn-outline-light me-4" data-bs-dismiss="modal">Confirmar</button>
          </div>
        </div>
      </div>
</template>

<script setup>
import actorPlaceholder from "@/assets/img/actorPlaceholder.png";
import { getActorMovies } from '@/utils/actorsUtils';
import { getGenresMovies } from '@/utils/genresUtils';
import { ref, watch, computed, onMounted } from 'vue';
const props = defineProps({
  type: String,
  data: Array,
  movies: Array,
  initialSelectedIds: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["save" ]);

const selectedValues = ref([])
const localData = ref([])
const inputSelection = ref("")



watch(() => [props.data, props.type, props.initialSelectedIds], ([newData, newType, newSelectedIds]) => {
    if (newData && newType) {
      const selectedIds = newSelectedIds || []

      const formatItem = (item) => {
        if (props.type === 'actor') {
          return {
            id: item.id,
            title: item.name,
            subtitle: `${getActorMovies(item.id, props.movies).length} Peliculas || ${item.dateOfBirth}`,
            photo: item.photo
          }
        } else if (props.type === 'genre') {
          return {
          id: item.id,
          title: item.name,
          subtitle: `${getGenresMovies(item.id, props.movies).length} Peliculas`,
          photo: null
          }
        } return {id:item.id, title: item.name, subtitle: '', photo:null}
      }

      const selectedItems = newData.filter(d => selectedIds.includes(d.id))
      selectedValues.value = selectedItems.map(formatItem).sort((a,b) => a.title.localeCompare(b.title)) 

      const availableItems = newData.filter(d => !selectedIds.includes(d.id))
      localData.value = availableItems.map(formatItem).sort((a,b) => a.title.localeCompare(b.title))
        } else {
          localData.value = []
          selectedValues.value = []
        }
}, { immediate: true });

const filteredData = computed(() => {
  return localData.value.filter(d => d.title.toLowerCase().includes(inputSelection.value.toLowerCase()))
})


const addValue = (dataId, data)=> {
    const isSelected = selectedValues.value.some(item => item.id === dataId)

    if (isSelected) {
        const dataToReturn = selectedValues.value.find(item => item.id === dataId)
        selectedValues.value = selectedValues.value.filter(item => item.id !== dataId)

        if (dataToReturn) {
            localData.value.push(dataToReturn)
        }

        localData.value.sort((a,b) => a.title.localeCompare(b.title))

        return
    }

    localData.value = localData.value.filter(item => item.id !== dataId)

    const dataToAdd = data || localData.value.find(item => item.id === dataId)
    localData.value = localData.value.filter(item => item.id !== dataId)

    if (dataToAdd) {
      selectedValues.value.push(dataToAdd)
      selectedValues.value.sort((a,b) => a.title.localeCompare(b.title))
    }
    
}

const submitValues = () => {
  const valuesId = selectedValues.value.map(v => v.id)
  emit('save', valuesId)
}

</script>

<style scoped lang="scss"> 
@use "sass:color";
@use "@/assets/scss/abstracts/variables" as *;
@use "@/assets/scss/abstracts/mixins" as *;


.modal-content {
    background-color: $secondary-color;
}

.header-bar {
    background-color: color.adjust($secondary-color, $lightness: -4%);
}

.header-bar p {
    color: color.adjust($text-light, $lightness: -30%);
}

.button-close {
    background-color: $secondary-color;
    border: 2px solid color.adjust($secondary-color, $lightness: 20%);
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:hover {
        background-color: color.adjust($secondary-color, $lightness: -3%);
    }
}

.item-img {
  height: 75px;
  width: 75px;
  object-fit: cover;
  object-position: center;
}

.subtitle {
    color: color.adjust($color: $secondary-color, $lightness: 50%);
}

.selected {
    border-left: 6px solid $primary-color;
    background-color: color.adjust($primary-color,  $alpha: -0.95);
    box-sizing: border-box;
}

.selected-checkbox {
    background-color: $secondary-color;
    border:2px solid color.adjust($secondary-color, $lightness: 20%);
    pointer-events: none; 

    &:checked {
        background-color: $primary-color;
        color: $text-light;
        border: none;
        background-size: 60% 60%; 
    }
}

</style>