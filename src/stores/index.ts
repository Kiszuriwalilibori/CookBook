import { useAdminStore, useIsAdminLogged } from "./useAdminStore";
import { useFiltersStore } from "./useFiltersStore";
import { useRecipesStore } from "./useRecipesStore";
import {useFingerprintStore} from "./useFingerprintsStore";
export { useFiltersStore, useRecipesStore, useAdminStore,useFingerprintStore, useIsAdminLogged };

// todo eśli chcesz, mogę Ci pokazać jeszcze:
// 👉 
// jak nazwać selektory w dużych aplikacjach Zustand (scalable pattern)