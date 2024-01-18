import { beforeEach, afterEach, describe, expect, it, vi, type Mock} from 'vitest'
import {EventDispatcher} from "../src/event-utils/event-dispatcher";
import {EventSource} from "../src/event-utils/event-source";
import {share} from "../src/event-utils/share";
import {filter} from "../src/event-utils/filter";
import {map} from "../src/event-utils/map";
import { once } from "../src/event-utils/once";
import {shareSplit} from "../src/event-utils/share-split";
import {
    acceptEventListenerObjects,
    EventSourceThatAcceptsEventListenerObjects
} from "../src/event-utils/accept-event-listener-objects";
import { withLatestFrom } from "../src/event-utils/with-latest-from";
import { concatMap } from "../src/event-utils/concat-map";
import { sequence } from "../src/event-utils/sequence";


describe('an event source', () => {
    let eventSource: EventDispatcher<number>;

    beforeEach(() => {
        eventSource = new EventDispatcher<number>();
    });

    describe('that is mapped and filtered and shared', () => {
        let mappedAndFilteredAndShared: EventSource<string>;
        let mapSpy: Mock;
        let filterSpy: Mock;

        beforeEach(() => {
            mapSpy = vi.fn();
            filterSpy = vi.fn();
            const mapped: EventSource<string> = map(eventSource, (ev: number) => {
                mapSpy();
                return ev % 2 === 0 ? 'a' : 'b';
            });
            const filtered: EventSource<string> = filter(mapped, ev => {
                filterSpy();
                return ev === 'a';
            });
            mappedAndFilteredAndShared = share(filtered);
        });

        describe('and then subscribed to twice', () => {
            let firstSubscriptionValue: string;
            let secondSubscriptionValue: string;
            let firstListener: (ev: string) => void;
            let secondListener: (ev: string) => void;

            beforeEach(() => {
                firstListener = (ev: string) => {
                    firstSubscriptionValue = ev;
                };
                secondListener = (ev: string) => {
                    secondSubscriptionValue = ev;
                };
                mappedAndFilteredAndShared.addListener(firstListener);
                mappedAndFilteredAndShared.addListener(secondListener);
            });

            describe('and then an event is dispatched to the original', () => {

                beforeEach(() => {
                    eventSource.dispatch(6);
                });

                it('the mapping should have happened only once', () => {
                    expect(mapSpy).toHaveBeenCalledTimes(1);
                });

                it('the filtering should have happened only once', () => {
                    expect(filterSpy).toHaveBeenCalledTimes(1);
                });

                it('the results should have been received', () => {
                    expect(firstSubscriptionValue).toEqual('a')
                    expect(secondSubscriptionValue).toEqual('a')
                });

                describe('and then one listener is removed and another event is dispatched to the original', () => {

                    beforeEach(() => {
                        mapSpy.mockClear();
                        filterSpy.mockClear();
                        mappedAndFilteredAndShared.removeListener(firstListener);
                        firstSubscriptionValue = undefined;
                        secondSubscriptionValue = undefined;
                        eventSource.dispatch(8);
                    });

                    it('only the second listener should have received a value', () => {
                        expect(firstSubscriptionValue).toEqual(undefined)
                        expect(secondSubscriptionValue).toEqual('a')
                    });

                    it('the mapping should have happened only once', () => {
                        expect(mapSpy).toHaveBeenCalledTimes(1);
                    });

                    it('the filtering should have happened only once', () => {
                        expect(filterSpy).toHaveBeenCalledTimes(1);
                    });

                    describe('and then the second listener is also removed and another event is dispatched to the original', () => {

                        beforeEach(() => {
                            mapSpy.mockClear();
                            filterSpy.mockClear();
                            mappedAndFilteredAndShared.removeListener(secondListener);
                            firstSubscriptionValue = undefined;
                            secondSubscriptionValue = undefined;
                            eventSource.dispatch(10);
                        });

                        it('none of the listeners should have received a value', () => {
                            expect(firstSubscriptionValue).toEqual(undefined)
                            expect(secondSubscriptionValue).toEqual(undefined);
                        });

                        it('the mapping should not have happened', () => {
                            expect(mapSpy).toHaveBeenCalledTimes(0);
                        });

                        it('the filtering should not have happened', () => {
                            expect(filterSpy).toHaveBeenCalledTimes(0);
                        });
                    });
                })
            });
        });
    });

    describe('that is mapped and filtered and shared and split', () => {
        let mappedFilteredSharedSplitFirst: EventSource<string>;
        let mappedFilteredSharedSplitSecond: EventSource<string>;
        let mapSpy: Mock;
        let filterSpy: Mock;

        beforeEach(() => {
            mapSpy = vi.fn();
            filterSpy = vi.fn();
            const mapped: EventSource<string> = map(eventSource, (ev: number) => {
                mapSpy();
                return ev % 2 === 0 ? 'a' : 'b';
            });
            const filtered: EventSource<string> = filter(mapped, ev => {
                filterSpy();
                return ev === 'a';
            });
            ({first: mappedFilteredSharedSplitFirst, second: mappedFilteredSharedSplitSecond} = shareSplit(filtered));
        });

        describe('that is subscribed to', () => {
            let firstListenerOne: (ev: string) => void;
            let firstListenerTwo: (ev: string) => void;
            let secondListenerOne: (ev: string) => void;
            let secondListenerTwo: (ev: string) => void;
            let result: {listenerId: string, value: string}[];

            beforeEach(() => {
                result = [];
                firstListenerOne = (ev: string) => {
                    result.push({listenerId: '11', value: ev});
                };
                firstListenerTwo = (ev: string) => {
                    result.push({listenerId: '12', value: ev});
                };
                secondListenerOne = (ev: string) => {
                    result.push({listenerId: '21', value: ev});
                };
                secondListenerTwo = (ev: string) => {
                    result.push({listenerId: '22', value: ev});
                };
                mappedFilteredSharedSplitSecond.addListener(secondListenerOne);
                mappedFilteredSharedSplitSecond.addListener(secondListenerTwo);
                mappedFilteredSharedSplitFirst.addListener(firstListenerOne);
                mappedFilteredSharedSplitFirst.addListener(firstListenerTwo);
            });

            describe('and then an event is dispatched to the original', () => {

                beforeEach(() => {
                    eventSource.dispatch(6);
                });

                it('should have processed the event in order', () => {
                    expect(result).toEqual([
                        {listenerId: '11', value: 'a'},
                        {listenerId: '12', value: 'a'},
                        {listenerId: '21', value: 'a'},
                        {listenerId: '22', value: 'a'}
                    ])
                });

                it('the mapping should have happened only once', () => {
                    expect(mapSpy).toHaveBeenCalledTimes(1);
                });

                it('the filtering should have happened only once', () => {
                    expect(filterSpy).toHaveBeenCalledTimes(1);
                });

                describe('and then all listeners are removed from the first and another event is dispatched', () => {

                    beforeEach(() => {
                        mappedFilteredSharedSplitFirst.removeListener(firstListenerOne);
                        mappedFilteredSharedSplitFirst.removeListener(firstListenerTwo);
                        mapSpy.mockClear();
                        filterSpy.mockClear();
                        result = [];
                        eventSource.dispatch(8);
                    });

                    it('should have processed the event', () => {
                        expect(result).toEqual([
                            {listenerId: '21', value: 'a'},
                            {listenerId: '22', value: 'a'}
                        ])
                    });

                    it('the mapping should have happened only once', () => {
                        expect(mapSpy).toHaveBeenCalledTimes(1);
                    });

                    it('the filtering should have happened only once', () => {
                        expect(filterSpy).toHaveBeenCalledTimes(1);
                    });

                    describe('and then all remaining listeners are removed and another event is dispatched', () => {

                        beforeEach(() => {
                            mappedFilteredSharedSplitSecond.removeListener(secondListenerOne);
                            mappedFilteredSharedSplitSecond.removeListener(secondListenerTwo);
                            mapSpy.mockClear();
                            filterSpy.mockClear();
                            result = [];
                            eventSource.dispatch(8);
                        });

                        it('should not have processed the event', () => {
                            expect(result).toEqual([])
                        });

                        it('the mapping should not have happened', () => {
                            expect(mapSpy).toHaveBeenCalledTimes(0);
                        });

                        it('the filtering should not have happened', () => {
                            expect(filterSpy).toHaveBeenCalledTimes(0);
                        });
                    });
                });
            });
        });
    });

    describe('that is combined with the latest from another', () => {
        let firstSourceMapListener: Mock;
        let mappedFirstEventSource: EventSource<number>;
        let otherEventSource: EventDispatcher<string>;
        let mappedOtherEventSource: EventSource<string>;
        let otherSourceMapListener: Mock;
        let combinedEventSource: EventSource<[number, string]>;
        let latestEmittedValue: [number, string];
        let combinedSourceListener: (values: [number, string]) => void;

        beforeEach(() => {
            firstSourceMapListener = vi.fn();
            otherSourceMapListener = vi.fn();
            mappedFirstEventSource = map(eventSource, (e) => {
                firstSourceMapListener();
                return e;
            })
            otherEventSource = new EventDispatcher();
            mappedOtherEventSource = map(otherEventSource, (e) => {
                otherSourceMapListener();
                return e;
            })
            combinedEventSource = withLatestFrom(mappedFirstEventSource, mappedOtherEventSource);
            combinedSourceListener = values => {latestEmittedValue = values;};
            combinedEventSource.addListener(combinedSourceListener);
        })

        it('should emit the correct values', () => {
            otherEventSource.dispatch('a');
            expect(latestEmittedValue).toBeUndefined();

            eventSource.dispatch(3);
            expect(latestEmittedValue).toEqual([3, 'a'])

            otherEventSource.dispatch('b');
            expect(latestEmittedValue).toEqual([3, 'a'])

            eventSource.dispatch(4);
            expect(latestEmittedValue).toEqual([4, 'b'])

            expect(firstSourceMapListener).toHaveBeenCalledTimes(2);
            expect(otherSourceMapListener).toHaveBeenCalledTimes(2);
        });

        describe('and when it is unsubscribed from', () => {

            beforeEach(() => {
                firstSourceMapListener.mockClear();
                otherSourceMapListener.mockClear();
                combinedEventSource.removeListener(combinedSourceListener);
            });

            it('should clean up properly', () => {
                otherEventSource.dispatch('a');
                expect(firstSourceMapListener).not.toHaveBeenCalled();
                expect(otherSourceMapListener).not.toHaveBeenCalled();

                eventSource.dispatch(3);
                expect(firstSourceMapListener).not.toHaveBeenCalled();
                expect(otherSourceMapListener).not.toHaveBeenCalled();
            });
        });
    });
});

describe('a once event source', () => {
    let eventSource: EventDispatcher<number>;
    let onceEventSource: EventSource<number>;

    beforeEach(() => {
        eventSource = new EventDispatcher<number>();
        onceEventSource = once(eventSource);
    });

    it('should emit once', () => {
        let result: number = 0;
        onceEventSource.addListener(n => result = n);
        eventSource.dispatch(5);

        expect(result).toBe(5);

        eventSource.dispatch(6);
        expect(result).toBe(5);
    });

    describe('that accepts event listener objects and is listened to', () => {
        let acceptingEventListenerObjects: EventSourceThatAcceptsEventListenerObjects<Event>;
        let listener: Mock;
        let eventListenerObject: EventListenerObject;

        beforeEach(() => {
            acceptingEventListenerObjects = acceptEventListenerObjects(map(onceEventSource, ev => (<Event>{})));
            listener = vi.fn();
            eventListenerObject = {
                handleEvent(evt: Event): void {
                    listener(evt);
                }
            };
            acceptingEventListenerObjects.addListener(eventListenerObject);
            eventSource.dispatch(5);
        });

        it('should have emitted once', () => {
            expect(listener).toHaveBeenCalled();
        });

        describe('and if the listener is then added again', () => {

            beforeEach(() => {
                listener.mockClear();
                acceptingEventListenerObjects.addListener(eventListenerObject);
                eventSource.dispatch(5);
            });

            it('should have emitted again', () => {
                expect(listener).toHaveBeenCalled();
            });
        })
    });

    describe('that is mapped and listened to', () => {
        let mapped: EventSource<number>;
        let listener: Mock;

        beforeEach(() => {
            mapped = map(onceEventSource, n => 2 * n);
            listener = vi.fn();
            mapped.addListener(listener);
            eventSource.dispatch(5);
        });

        it('should have emitted once', () => {
            expect(listener).toHaveBeenCalledWith(10);
        });

        describe('and if the listener is then added again', () => {

            beforeEach(() => {
                listener.mockClear();
                mapped.addListener(listener);
                eventSource.dispatch(5);
            });

            it('should have emitted again', () => {
                expect(listener).toHaveBeenCalledWith(10);
            });
        });
    });
});

describe('an event source that is concatMapped', () => {
    let counter: number;
    let eventSource: EventDispatcher<void>;
    let concatMapped: EventSource<number>;

    beforeEach(() => {
        counter = 0;
        eventSource = new EventDispatcher();
        concatMapped = concatMap(eventSource, () => sequence([counter++, counter++, counter++]))
    });

    it('should emit the right events', () => {
        const seen: number[] = [];
        concatMapped.addListener(n => seen.push(n));
        eventSource.dispatch();
        expect(seen).toEqual([0, 1, 2]);
        eventSource.dispatch();
        expect(seen).toEqual([0, 1, 2, 3, 4, 5]);
    });
});

describe('an event dispatcher', () => {
    let eventSource: EventSource<number>;
    
    beforeEach(() => {
        eventSource = new EventDispatcher<number>();
    });

    describe('to which a listener is added', () => {
        let removedSpy: Mock;
        let listener: Mock;

        beforeEach(() => {
            removedSpy = vi.fn();
            listener = vi.fn();
            eventSource.addListener(listener, removedSpy)
        })

        it('should call the removed callback when listener is removed', () => {
            eventSource.removeListener(listener)
            expect(removedSpy).toHaveBeenCalled();
        })

        afterEach(() => {
            removedSpy.mockClear()
            listener.mockClear()
        })
    })
})
