export enum Units{
    CSS, CANVAS
}
export interface Config{
    greedyGestureHandling: boolean
    rotationEnabled: boolean,
    units: Units
}
export class ConfigImpl implements Config{
    static from(config: Config): ConfigImpl{
        return new ConfigImpl(
            config.greedyGestureHandling,
            config.rotationEnabled,
            config.units);
    }
    static default: ConfigImpl = ConfigImpl.from({greedyGestureHandling: false, rotationEnabled: true, units: Units.CANVAS})
    constructor(
        public greedyGestureHandling: boolean,
        public rotationEnabled: boolean,
        public units: Units){
    }
    public change(config?: Partial<Config>): ConfigImpl{
        if(!config){
            return ConfigImpl.default;
        }
        const greedyGestureHandling = config.greedyGestureHandling === undefined ? this.greedyGestureHandling : config.greedyGestureHandling;
        const rotationEnabled = config.rotationEnabled === undefined ? this.rotationEnabled : config.rotationEnabled;
        const units = config.units === undefined ? this.units : config.units;
        if(
            greedyGestureHandling === this.greedyGestureHandling && 
            rotationEnabled === this.rotationEnabled &&
            units === this.units){
            return this;
        }
        return new ConfigImpl(greedyGestureHandling, rotationEnabled, units);
    }
    public getSearchParams(): URLSearchParams{
        const result = new URLSearchParams();
        result.set('greedyGestureHandling', this.greedyGestureHandling.toString());
        result.set('rotationEnabled', this.rotationEnabled.toString());
        result.set('units', this.units === Units.CANVAS ? 'canvas' : 'css');
        return result;
    }
}
