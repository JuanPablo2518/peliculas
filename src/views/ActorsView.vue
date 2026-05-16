<!-- Actors View -->

<template>
    <!-- Title -->
    <h1 class="actors-title text-center my-5">Ingresar Actores</h1>

    <ActorForm :actor="selectedActor" @save="saveActor" @cancel="resetForm" />

    <button class="btn btn-success" @click="activeFilter = (activeFilter === 'asc' ? 'desc' : 'asc')">Ordenar: {{
        activeFilter === 'asc' ? 'A - Z' : 'Z - A' }}</button>

    <!-- Table of actors -->
    <table class="table table-striped mb-5">
        <thead>
            <tr>

                <th>Nombre</th>
                <!-- <th>Acciones</th> -->
            </tr>
        </thead>
        <tbody>
            <!-- Table Content -->
            <tr v-for="actor in sortedActors" :key="actor.id">
                <td>
                    <a data-bs-toggle="collapse" :data-bs-target="'#actorContent' + actor.id"
                        class="d-flex align-items-center justify-content-between px-3 py-2">
                        {{ actor.name }} <font-awesome-icon icon="fa-solid fa-angle-down" />
                    </a>


                    <div :id="'actorContent' + actor.id" class="collapse table-content ">
                        <div class="d-flex flex-column flex-md-row align-items-center  p-5 gap-5">
                            <div class="d-flex flex-column flex-shrink-0 me-1 me-md-3 me-lg-5">
                                <img :src="actor.photo || 'https://png.pngtree.com/png-vector/20221010/ourmid/pngtree-actors-icon-png-image_6293100.png'"
                                    class="img-fluid " alt="">
                                <div class="d-flex justify-content-between mt-3">
                                    <button class="btn btn-primary btn-sm" @click="editActor(actor)">Editar</button>
                                    <button data-bs-toggle="modal" data-bs-target="#actorModal"
                                        @click="actorId = actor.id" class="btn btn-danger btn-sm">Eliminar</button>
                                </div>
                            </div>
                            <div class="table-content w-100  px-3 py-4">


                                <div class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-user" />
                                    <p class="mb-0" v-if="!isEditing"> Nombre: {{ actor.name }}</p>
                                    <input class="form-control" v-else type="text" :value="actor.name"
                                        :placeholder="actor.name">
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-book" />
                                    <p class="mb-0" v-if="!isEditing"> Biografia: {{ actor.biography || "Sin Biografia"
                                    }}</p>
                                    <textarea class="form-control" v-else type="text" :value="actor.biography"
                                        :placeholder="actor.biography"> </textarea>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-cake-candles" />
                                    <p class="mb-0" v-if="!isEditing"> Fecha de nacimiento: {{ actor.dateOfBirth }}</p>
                                    <input class="form-control" v-else type="date" :value="actor.dateOfBirth"
                                        :placeholder="actor.dateOfBirth">
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-dove" />
                                    <p class="mb-0" v-if="!isEditing"> Fecha de fallecimiento: {{ actor.dateOfDeath }}
                                    </p>
                                    <input class="form-control" v-else type="date" :value="actor.dateOfDeath"
                                        :placeholder="actor.dateOfDeath">
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <div>
                                        <font-awesome-icon v-if="actor.gender === 'M'" class="actor-icon"
                                            icon="fa-solid fa-mars" />
                                        <font-awesome-icon v-else class="actor-icon" icon="fa-solid fa-venus" />
                                    </div>
                                    <p class="mb-0" v-if="!isEditing"> Genero: {{ actor.gender }}</p>
                                    <select class="form-select" v-else v-model="actor.gender">
                                        <option value="">Seleccione</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-map" />
                                    <p class="mb-0" v-if="!isEditing"> Ubicacion Nacimiento: {{ actor.birthLocation }}
                                    </p>
                                    <input class="form-control" v-else type="text" :value="actor.birthLocation"
                                        :placeholder="actor.birthLocation">
                                </div>

                                <div v-if="isEditing" class="d-flex align-items-center mb-3">
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-camera" />
                                    <input class="form-control" type="text" :value="actor.photo"
                                        :placeholder="actor.photo">
                                </div>
                                <p>
                                    <font-awesome-icon class="actor-icon" icon="fa-solid fa-star" />
                                    Ranking TMDB: {{ actor.tmdbPopularity }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- <td>
                    <button class="btn btn-primary btn-sm" @click="editActor(actor)">Editar</button>
                    <button data-bs-toggle="modal" data-bs-target="#actorModal" @click="actorId = actor.id"
                        class="btn btn-danger btn-sm">Eliminar</button>
                </td> -->
                </td>
            </tr>
        </tbody>
    </table>

    <div class="modal fade" id="actorModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Advertencia</h5>

                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    {{ toDeleteMovies.length > 0 ? ` Este actor aparece en ${toDeleteMovies.length} peliculas, al borrar
                    este
                    actor, este desaparecera de estas mismas, ¿desea continuar?` : "¿Desea borrar este actor?" }}

                    <div class="my-3" v-for="movie in toDeleteMovies" :key="movie.id">
                        + {{ movie.name }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="removeActor(actorId)" class="btn btn-primary"
                        data-bs-dismiss="modal">Eliminar</button>
                    <button class="btn btn-secondary" data-bs-dismiss="modal">
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
// VUE Libraries
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useToast } from "vue-toastification";
// Services
import {
    createActor,
    updateActor,
    deleteActor,
    subscribeActors
} from "@/services/actorService";
import { subscribeMovies } from "@/services/movieService";
// Components
import ActorForm from "@/components/ActorForm.vue";


// Composables
const toast = useToast()

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const actors = ref([])
const movies = ref([])
const actorId = ref(null)
const selectedActor = ref(null)
const isEditing = ref(false)
const activeFilter = ref("")

// Computed

const toDeleteMovies = computed(() => {
    return movies.value.filter((movie) => movie.actors.includes(actorId.value));
})

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted
onMounted(() => {
    unsubscribe = subscribeActors((data) => {
        actors.value = data
    })
    unsubscribeMovies = subscribeMovies((data) => {
        movies.value = data
    })

})

// Method to unsubscribe when the component is unmounted
onUnmounted(() => {
    if (unsubscribe) unsubscribe()
    if (unsubscribeMovies) unsubscribeMovies()
})

// Methods

/**
* Method to save the actor in the database
* If the form is in edit mode, it will use the update method to update the data in the database based on the selected actor's ID
* If the form is NOT in edit mode, it will use the create method to insert data into the database
*/

const saveActor = async (actor) => {
    if (isEditing.value) {
        await updateActor(selectedActor.value.id, actor)
        toast.success("Se ha editado correctamente el actor.")
    } else {
        createActor(actor)
        toast.success("Se ha ingresado correctamente el actor.")
    }

    resetForm()
}

// Method that activates edit mode
const editActor = (actor) => {
    selectedActor.value = actor
    isEditing.value = true
}

/**
* Method to delete actors from the database
* First, it shows a message to confirm whether the user wants to delete the data
* If so, it deletes the data from the database and notifies the user
*/


const removeActor = async (id) => {
    await deleteActor(id, toDeleteMovies.value)
    toast.success("Se ha eliminado correctamente el actor.")
}

const resetForm = () => {
    selectedActor.value = null
    isEditing.value = false
}

const sortedActors = computed(() => {
    const copy = [...actors.value]

    if (!activeFilter.value) return copy

    copy.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        if (activeFilter.value === 'asc') {
            return nameA.localeCompare(nameB)
        } else {
            return nameB.localeCompare(nameA)
        }
    })
    return copy
})

</script>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/variables' as *;
@use '@/assets/scss/abstracts/mixins' as *;

.actors-title {
    font-weight: 800;
    font-size: clamp(1.80rem, 3vw, 3.6rem);
}

.table {
    table-layout: fixed;
}

img {
    aspect-ratio: 3 / 4;
    width: clamp(150px, 13vw, 300px);
    object-fit: cover;
}

.actor-icon {
    color: $primary-color;
    margin-right: 4px;
}
</style>