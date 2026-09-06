import {
  between,
  minLength,
  required,
  requiredIf,
  url,
} from "@vuelidate/validators";
import { computed } from "vue";

export const getActorRules = (enabledDD) => {
  const actualYear = new Date().getFullYear();
  const oneOfGender = (value) => ["M", "F"].includes(value);

  return computed(() => ({
    name: { required, minLength: minLength(4) },
    biography: { minLength: minLength(50) },
    yearBirthDate: { required, between: between(1900, actualYear) },
    yearDeathDate: {
      required: requiredIf(enabledDD),
      between: enabledDD.value ? between(1900, actualYear) : {},
    },
    gender: { oneOfGender },
    birthLocation: { minLength: minLength(10) },
    photo: { url },
  }));
};
