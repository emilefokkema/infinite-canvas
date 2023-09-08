import { fromEvent, filter, map, type Observable } from 'rxjs'

export interface ExamplesNavigator{
    next: Observable<void>
    previous: Observable<void>
}

export function createExamplesNavigator(): ExamplesNavigator{
    const next = fromEvent<KeyboardEvent>(window, 'keydown').pipe(filter(e => e.key === 'ArrowDown'), map(() => {}));
    const previous = fromEvent<KeyboardEvent>(window, 'keydown').pipe(filter(e => e.key === 'ArrowUp'), map(() => {}));
    return { next, previous };
}