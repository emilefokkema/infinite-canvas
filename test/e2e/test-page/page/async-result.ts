import { AsyncResult as AsyncResultInterface } from './interfaces';

export class AsyncResult<T = any> implements AsyncResultInterface<T>{
    constructor(public readonly promise: Promise<T>){

    }
}