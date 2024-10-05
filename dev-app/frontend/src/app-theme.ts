import { ref, inject, computed, type Ref } from 'vue'
import { useTheme } from 'vuetify'
import { appThemeInjectionKey } from './constants'

export interface AppTheme{
    dark: Ref<boolean>
}

export function createAppTheme(initiallyDark: boolean): AppTheme{
    const dark = ref(initiallyDark)
    return { dark }
}

export function useAppTheme(): AppTheme{
    const theme = useTheme()
    const appTheme = inject(appThemeInjectionKey) as AppTheme
    const dark = computed({
        set(value: boolean){
            appTheme.dark.value = value;
            theme.global.name.value = value ? 'dark' : 'light'
        },
        get(){
            return appTheme.dark.value;
        }
    })
    return { dark }
}