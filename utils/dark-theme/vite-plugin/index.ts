import { PluginOption } from 'vite'
import { addDarkCssLoader } from './add-dark-css-loader';
import { addIndexDarkToInput } from './add-index-dark';

export function addDarkTheme(): PluginOption[]{
    return [
        addDarkCssLoader(),
        addIndexDarkToInput()
    ]
}