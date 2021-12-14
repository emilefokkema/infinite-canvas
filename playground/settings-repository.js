import Units from './units';

function getDefaultSettings(isSmallWidth){
    return {
        width: 300,
        height: 150,
        units: Units.CANVAS,
        rotationEnabled: true,
        greedyGestureHandling: !isSmallWidth,
        isHorizontal: isSmallWidth,
        inputContainerWidth: 300,
        canvasHeight: 300
    };
}

export class SettingsRepository{
    constructor(playgroundLocalStorage, isSmallWidth, settings){
        this.playgroundLocalStorage = playgroundLocalStorage;
        this.isSmallWidth = isSmallWidth;
        this.settings = settings;
    }
    getSettings(){
        const result = {};
        Object.assign(result, this.settings);
        result.isHorizontal = this.isSmallWidth || this.settings.isHorizontal;
        return result;
    }
    setSettings(settings){
        const newSettings = {};
        Object.assign(newSettings, settings);
        newSettings.isHorizontal = this.isSmallWidth ? this.settings.isHorizontal : settings.isHorizontal
        this.settings = newSettings;
        this.playgroundLocalStorage.setItem('settings', this.settings);
    }
    static create(playgroundLocalStorage, isSmallWidth){
        const settings = getDefaultSettings(isSmallWidth);
        const storedSettings = playgroundLocalStorage.getItem('settings') || {};
        Object.assign(settings, storedSettings);
        return new SettingsRepository(playgroundLocalStorage, isSmallWidth, settings);
    }
}