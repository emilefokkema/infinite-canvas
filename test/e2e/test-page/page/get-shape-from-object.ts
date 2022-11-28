type ArrayLike<T> = {
    length: number;
    [index: number]: T;
}

interface PrimitiveMap{
    a: number;
    b: string;
    c: null;
    d: undefined;
    e: boolean;
    f: symbol;
    g: bigint;
}
type Primitive<T> = PrimitiveMap[{[K in keyof PrimitiveMap]: T extends PrimitiveMap[K] ? K : never}[keyof PrimitiveMap]];

type Shape<T> = T extends (number|string|null|undefined|boolean|symbol|bigint) ? Primitive<T> :  T extends ArrayLike<infer TI> ? Shape<TI>[] : {[K in keyof T]: Shape<T[K]>};

function isArrayLike<T, TI>(obj: T): obj is ArrayLike<TI> & T{
    return typeof (<any>obj).length === 'number';
}

export function getShapeFromObject<T>(shape: T, obj: T): Shape<T>{
    if(typeof shape !== 'object'){
        if(typeof obj === 'undefined'){
            throw new Error(`expected value of type ${typeof shape} but got undefined`)
        }
        if(typeof obj !== typeof shape){
            throw new Error(`expected value of type ${typeof shape} but got a(n) ${typeof obj}`)
        }
        return <Shape<T>>obj;
    }
    if(typeof obj !== 'object'){
        throw new Error(`expected object but got value of type ${typeof obj}`)
    }
    if(Array.isArray(shape)){
        if(!isArrayLike(obj)){
            throw new Error(`expected Array-like value, but ${JSON.stringify(obj)} has no number-valued 'length'`)
        }
        const arrayResult = [];
        const itemShape = shape[0];
        for(let i = 0; i < obj.length; i++){
            arrayResult.push(getShapeFromObject(itemShape, obj[i]));
        }
        return <Shape<T>>arrayResult;
    }
    const result = <any>{};
    for(let key in shape){
        const shapeValue = shape[key];
        const objValue = obj[key];
        result[key] = getShapeFromObject(shapeValue, objValue);
    }
    return result;
}