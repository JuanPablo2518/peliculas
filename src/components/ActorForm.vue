<!-- ActorForm component
This component is the form where actors can be created/updated -->
<template>
    <form @submit.prevent="submitForm" class="mb-5">
        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': v$.name.$error }" v-model="name">
            <div class="invalid-feedback" v-if="v$.name.required.$invalid">
                Por favor, ingrese un nombre
            </div>
            <div class="invalid-feedback" v-if="v$.name.minLength.$invalid">
                El nombre debe ser de al menos {{ v$.name.minLength.$params.min }} caracteres.
            </div>
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
            <button type="button" class="btn btn-danger" @click="cancelEdit" v-if="props.actor">Cancelar
                Edicion</button>
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


// COMPOSABLES
const toast = useToast();

// PROPS
const props = defineProps({
    actor: Object
})

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
const photo = ref("")
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


    if (props.actor?.name !== name.value) {
        if (actors.find(a => a.name.trim().toLowerCase() === name.value.trim().toLowerCase())) {
            toast.warning("El actor ingresado ya existe.")
            return
        }
    }

    emit('save', {
        name: name.value,
        biography: biography.value,
        dateOfBirth: dateOfBirth.value,
        dateOfDeath: dateOfDeath.value,
        gender: gender.value,
        birthLocation: birthLocation.value,
        tmdbPopularity: tmdbPopularity.value,
        photo: photo.value
    })

    resetForm()
    v$.value.$reset()
}

const cancelEdit = () => {
    resetForm()
    v$.value.$reset()
    emit('cancel')
}

const resetForm = () => {
    name.value = ""
    biography.value = ""
    dateOfBirth.value = ""
    dateOfDeath.value = ""
    gender.value = ""
    birthLocation.value = ""
    tmdbPopularity.value = ""
    photo.value = ""
}

// WATCHERS

// Watch used to assign the actor prop value after it loads
watch(() => props.actor, (newActor) => {
    if (newActor) {
        name.value = newActor.name
        biography.value = newActor.biography
        dateOfBirth.value = newActor.dateOfBirth
        dateOfDeath.value = newActor.dateOfDeath
        gender.value = newActor.gender
        birthLocation.value = newActor.birthLocation
        tmdbPopularity.value = newActor.tmdbPopularity
        photo.value = newActor.photo
    }
})

watch(enabledDD, (value) => {
    if (!value) dateOfDeath.value = ""
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
</style>