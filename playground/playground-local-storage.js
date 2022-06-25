export class PlaygroundLocalStorage{
    constructor(data){
        this.data = data;
    }
    getItem(key){
        return this.data[key];
    }
    setItem(key, value){
        this.data[key] = value;
        localStorage.setItem('playground', JSON.stringify(this.data));
    }
    static create(){
        const stringified = localStorage.getItem('playground');
        const data = stringified ? JSON.parse(stringified) : {};
        return new PlaygroundLocalStorage(data);
    }
}