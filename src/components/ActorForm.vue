<!-- ActorForm component
This component is the form where actors can be created/updated -->
<template>
    <div class="tmdb-search-container my-5 p-4  rounded shadow-sm ">
        <label class="form-label fw-bold">Buscar en TMDB para autocompletar</label>
        <div class="position-relative">
            <input type="text" class="form-control color-white" placeholder="Escribe el nombre del actor" v-model="tmdbSearchTerm" @input="searchInTMDB">
            <div class="list-group mt-1 position-absolute w-100 shadow" v-if="tmdbResults?.length" style="z-index: 1000;">
                <button type="button" v-for="res in tmdbResults" :key="res.id" class="tmdb-search-button list-group-item list-group-item-action d-flex align-items-center" @click="selectTMDBActor(res.id)">
                    <img :src=" res.profile_path ? 'https://image.tmdb.org/t/p/w92' + res.profile_path : 'https://png.pngtree.com/png-vector/20221010/ourmid/pngtree-actors-icon-png-image_6293100.png'" class="me-3 rounded" style="width: 40px;">
                    <div>
                        <p class="d-inline">
                            {{ res.name }} 
                        </p> 
                        <br>
                        <small class="text-muted">{{ res.dateOfBirth }}</small>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control mb-1" :class="{ 'is-invalid': v$.name.$error }" v-model="name">
            <div class="invalid-feedback" v-if="v$.name.required.$invalid">
                Por favor, ingrese un nombre
            </div>
            <div class="invalid-feedback " v-if="v$.name.minLength.$invalid">
                El nombre debe ser de al menos {{ v$.name.minLength.$params.min }} caracteres.
            </div>
            <p  v-if="resetTMDBPopularity">El campo "Popularidad TMDB" a sido eliminado: <a class="text-decoration-underline" style="cursor:pointer" @click="restoreTMDB" >Reestablecer</a></p>
        </div>

        <div class="mb-3">
            <label class="form-label">Foto (URL)</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.photo.$error }" v-model="photo">
            <div class="invalid-feedback" v-if="photo && v$.photo.url.$invalid">
                La URL ingresada es incorrecta.
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Biografia</label>
            <textarea class="form-control" :class="{ 'is-invalid': v$.biography.$error }"
                v-model="biography"></textarea>
            <div class="invalid-feedback" v-if="v$.biography.minLength.$invalid">
                La biografia debe ser de al menos {{ v$.biography.minLength.$params.min }} caracteres.
            </div>
        </div>

        <div class=" row mb-3 ">
            <div class="col-md-6 mb-3">
                <label class="form-label">Fecha de nacimiento</label>
                <input type="date" class="form-control" :class="{ 'is-invalid': v$.yearBirthDate.$error }"
                    v-model="dateOfBirth">
                <div class="invalid-feedback" v-if="v$.yearBirthDate.required.$invalid">
                    Por favor, ingrese una fecha
                </div>
                <div class="invalid-feedback" v-if="v$.yearBirthDate.between.$invalid">
                    El año ingresado es invalido
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <input type="checkbox" class="date-check me-2 form-check-input" v-model="enabledDD" id="">
                <label class="form-label">Fecha de fallecimiento</label>
                <input :disabled="!enabledDD" type="date" class="form-control"
                    :class="{ 'is-invalid': v$.yearDeathDate.$error }" v-model="dateOfDeath">
                <div class="invalid-feedback" v-if="v$.yearDeathDate.required.$invalid">
                    Por favor, ingrese una fecha
                </div>
                <div class="invalid-feedback" v-if="v$.yearDeathDate.between.$invalid">
                    El año ingresado es invalido
                </div>
            </div>
        </div>


        <div class="row mb-3">
            <div class="col-md-4 mb-3">
                <label class="form-label">Genero</label>
                <select class="form-select" :class="{ 'is-invalid': v$.gender.$error }" v-model="gender">
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </select>
                <div class="invalid-feedback" v-if="v$.gender.oneOfGender.$invalid">
                    Por favor, Seleccione un genero
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Ubicacion nacimiento</label>
                <input type="text" class="form-control" :class="{ 'is-invalid': v$.birthLocation.$error }"
                    v-model="birthLocation">
                <div class="invalid-feedback" v-if="v$.birthLocation.minLength.$invalid">
                    El nombre debe ser de al menos {{ v$.birthLocation.minLength.$params.min }} caracteres.
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <label class="form-label">Popularidad TMDB</label>
                <input disabled type="text" class="form-control" v-model="tmdbPopularity">
            </div>
        </div>

        <div class="d-flex gap-3">
            <button class="btn save-button">Guardar</button>
        </div>
    </form>
</template>

<script setup>
// VUE Libraries
import { computed, reactive, ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { between, minLength, required, requiredIf, url } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
// Services
import { getActors } from '@/services/actorService';
import { searchTMDBActors, getTMDBActorsDetails } from '@/services/tmdbService';


// COMPOSABLES
const toast = useToast();

// PROPS


// Constants

const actualYear = new Date().getFullYear()

// EMITS (from actorsView)

const emit = defineEmits(['save', 'cancel'])


// REFS
const name = ref('')
const biography = ref('')
const dateOfBirth = ref('')
const dateOfDeath = ref('')
const enabledDD = ref(false)
const gender = ref('')
const birthLocation = ref('')
const tmdbPopularity = ref(0)
const tmdbId = ref(null)
const photo = ref("")

const tmdbSearchTerm = ref('')
const tmdbResults = ref([])
const resetTMDBPopularity = ref(false)
const tmdbOriginalName = ref(null)

// COMPUTED
const yearBirthDate = computed(() => Number(dateOfBirth.value.split("-")[0]))
const yearDeathDate = computed(() => Number(dateOfDeath.value.split("-")[0]))


// Vuelidate

const oneOfGender = (value => ['M', 'F'].includes(value))

const rules = computed(() => ({
    name: { required, minLength: minLength(4) },
    biography: { minLength: minLength(50) },
    yearBirthDate: { required, between: between(1900, actualYear) },
    yearDeathDate: { required: requiredIf(enabledDD), between: enabledDD.value ? between(1900, actualYear) : {} },
    gender: { oneOfGender },
    birthLocation: { minLength: minLength(10) },
    photo: { url }

}))

const state = reactive({ name, biography, yearBirthDate, yearDeathDate, gender, birthLocation, photo })
const v$ = useVuelidate(rules, state)


// METHODS

/**

* Method used to submit the form data
* Checks whether the value exists and meets the Vuelidate requirements
* If valid: uses the save emit defined in actorsView, and resets the form
* If not valid, returns null
*/

const submitForm = async () => {
    const result = await v$.value.$validate()
    if (!result) return

    const actors = await getActors()


        if (actors.find(a => a.name.trim().toLowerCase() === name.value.trim().toLowerCase())) {
            toast.warning("El actor ingresado ya existe.")
            return
        }

    emit('save', {
        name: name.value,
        biography: biography.value,
        dateOfBirth: dateOfBirth.value,
        dateOfDeath: dateOfDeath.value,
        gender: gender.value,
        birthLocation: birthLocation.value,
        tmdbPopularity: tmdbPopularity.value,
        tmdbId: tmdbId.value, 
        photo: photo.value
    })

    resetForm()
    v$.value.$reset()
}

const searchInTMDB = async () => {
    if (tmdbSearchTerm.value.length < 3) {
        tmdbResults.value = []
        return
    }
    tmdbResults.value = await searchTMDBActors(tmdbSearchTerm.value)
}

const selectTMDBActor = async (id) => {
    const a = await getTMDBActorsDetails(id)

    if (!a) {
        toast.error("No se pudieron cargar los detalles de este actor.");
        return;
    }

    name.value = a.name
    tmdbOriginalName.value = a.name
    biography.value = a.biography
    dateOfBirth.value = a.birthday || ""
    dateOfDeath.value = a.deathday || ""
    gender.value = a.gender !== 2 ? "F" : "M"
    birthLocation.value = a.place_of_birth
    tmdbPopularity.value = a.popularity
    photo.value = a.profile_path ? `https://image.tmdb.org/t/p/w500${a.profile_path}` : ""
    tmdbId.value = id


    tmdbResults.value = []
    tmdbSearchTerm.value = ''
}


const resetForm = () => {
    name.value = ""
    biography.value = ""
    dateOfBirth.value = ""
    dateOfDeath.value = ""
    gender.value = ""
    birthLocation.value = ""
    tmdbPopularity.value = ""
    tmdbId.value = null;
    photo.value = ""
}

const restoreTMDB = async () => {
    const actorToRestore = await searchTMDBActors(tmdbOriginalName.value)

    if (!actorToRestore) return

    name.value = actorToRestore[0].name
    tmdbPopularity.value = actorToRestore[0].popularity
    tmdbId.value = actorToRestore[0].id
    resetTMDBPopularity.value = false
}

// WATCHERS



watch(enabledDD, (value) => {
    if (!value) dateOfDeath.value = ""
})

watch(name, (newValue) => {
    if (!tmdbId.value) return

    const nameChanged = newValue !== tmdbOriginalName.value
    resetTMDBPopularity.value = nameChanged

    if (nameChanged) {
        tmdbId.value = null
        tmdbPopularity.value = null
    }
})

</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/scss/abstracts/variables' as *;
@use '@/assets/scss/abstracts/mixins' as *;

.save-button {
    background-color: $primary-color;
    color: $text-light;
    font-weight: 700;

    &:hover {
        background-color: color.adjust($primary-color, $lightness: -10%);
        color: $text-light
    }
}

.date-check {
    outline: none;
    background-color: $secondary-color;
    border: 2px solid $primary-color;

    &:checked {
        background-color: $primary-color;
        border: none;
    }

    &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
        color: $text-light;
    }

}

input::placeholder {
    color: rgb(233, 226, 226);
    opacity: 0.5;
}

.tmdb-search-container {
    border: 2px solid $primary-color
}

.tmdb-search-button {
    background-color: $secondary-color;
    border: 2px solid $primary-color;
    border-top: 0;
    color: white;
}

.tmdb-search-button:first-child{
    border-top: 0px solid red ;
}
</style>