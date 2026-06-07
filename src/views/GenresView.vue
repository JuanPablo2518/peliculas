<!-- Genres View -->

<template>
    <!-- Title -->
    <h2 class="text-center my-5" >Géneros</h2>

    <GeneresForm :genre="selectedGenre" @save="saveGenre" @cancel="resetForm" />

    <div class="w-100 w-lg-75 mx-auto">
        
        <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex gap-3 ">
                <h5 class="m-0">Listado</h5>
                <p class="small border border-2 rounded px-3">{{ genres.length }} géneros</p>
            </div>
            <button class="btn btn-outline-light " @click="activeFilter = (activeFilter === 'asc' ? 'desc' : 'asc')"><font-awesome-icon icon="fa-solid fa-up-down" /> {{
            activeFilter === 'asc' ? 'A <- Z' : 'Z -> A' }}</button>
        </div>
    <!-- Table of genres -->
     <div class="rounded-3 overflow-hidden">
            <table class="table table-striped mb-5  mx-auto">
        <thead>
            <tr>
                <th class="text-muted ps-4">Nombre</th>
                <th class="text-muted text-end pe-4" >Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- Table Content -->
            <tr class="align-middle " v-for="genre in sortedGenres" :key="genre.id">
                    <td class="py-2 ps-4  ">{{ genre.name }}</td> 
                <td  class=" py-2 px-5   ">
                    <div class="d-flex justify-content-end align-items-end flex-column flex-md-row gap-3 gap-md-5">
                        <button class="btn  btn-yellow d-flex flex-column flex-md-row align-items-center gap-2 px-3 rounded-2 btn-sm action-btn flex-shrink-0" @click="editGenre(genre)">
                            <font-awesome-icon icon="fa-solid fa-pen-to-square responsive-icon" />
                            <span>Editar</span>
                        </button>
                        <button data-bs-toggle="modal" data-bs-target="#genreModal" class="btn  btn-danger d-flex flex-column flex-md-row align-items-center gap-2 action-btn btn-sm flex-shrink-0"
                            @click="genreId = genre.id">
                            <font-awesome-icon icon="fa-solid fa-trash responsive-icon" />
                            <span>Eliminar</span>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
     </div>
    </div>
    <div class="modal fade" id="genreModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">Advertencia</h5>

                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    {{ toDeleteMovies.length > 0 ? ` Este genero aparece en ${toDeleteMovies.length} peliculas, al
                    borrar
                    este
                    genero, este desaparecera de estas mismas, ¿desea continuar?` : "¿Desea borrar este genero?" }}

                    <div class="my-3" v-for="movie in toDeleteMovies" :key="movie.id">
                        + {{ movie.name }}
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="removeGenre(genreId)" class="btn btn-primary"
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
import { useToast } from "vue-toastification";
import { ref, onMounted, onUnmounted, computed } from "vue"
// Services
import {
    createGenre,
    updateGenre,
    deleteGenre,
    subscribeGenres
} from "@/services/genreService";
import { subscribeMovies } from "@/services/movieService";
// Components
import GeneresForm from "@/components/GenresForm.vue";

// Composables
const toast = useToast()

// Let
let unsubscribe;
let unsubscribeMovies;

// Refs
const genres = ref([])
const movies = ref([])
const genreId = ref(null)
const selectedGenre = ref(null)
const isEditing = ref(false)
const activeFilter = ref("")

// Computed

const toDeleteMovies = computed(() => {
    return movies.value.filter((movie) => movie.genres.includes(genreId.value));
})

// Lifecycle Hooks


// Method to start the subscription that updates data in real time when the component is mounted

onMounted(() => {
    unsubscribe = subscribeGenres((data) => {
        genres.value = data
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
* Method to save the genre in the database
* If the form is in edit mode, it will use the update method to update the data in the database based on the selected genre's ID
* If the form is NOT in edit mode, it will use the create method to insert data into the database
*/

const saveGenre = async (genre) => {
    if (isEditing.value) {
        await updateGenre(selectedGenre.value.id, genre)
        toast.success("Género actualizado correctamente.")
    } else {
        createGenre(genre)
        toast.success("Género ingresado correctamente.")
    }

    resetForm()

}

// Method that activates edit mode
const editGenre = (genre) => {
    selectedGenre.value = genre
    isEditing.value = true
}

/**
* Method to delete genres from the database
* First, it shows a message to confirm whether the user wants to delete the data
* If so, it deletes the data from the database and notifies the user
*/

const removeGenre = async (id) => {
    await deleteGenre(id, toDeleteMovies.value)
    toast.success("Género eliminado correctamente.")
}
const resetForm = () => {
    selectedGenre.value = null
    isEditing.value = false
}

const sortedGenres = computed(() => {
    const copy = [...genres.value]

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
.action-btn {
    width:  clamp(80px, 12vw, 110px);
}
</style>