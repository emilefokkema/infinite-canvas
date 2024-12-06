
type Chart = undefined | true | {[key in keyof any]: Chart}
export function serializeEvent(
        value: unknown,
        chart: Chart
    ): unknown{
        if(chart === undefined){
            return undefined;
        }
        if(Array.isArray(value)){
            const itemChart = typeof chart !== 'boolean' && '0' in chart ? chart[0] : chart;
            return value.map(v => serializeEvent(v, itemChart))
        }
        if(typeof chart === 'boolean'){
            if(value === null || value === undefined || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'bigint'){
                if(chart !== true){
                    return undefined;
                }
                return value;
            }
            return undefined;
        }
        const result: {[key in keyof any]: unknown} = {};
        for(const key of Object.keys(chart)){
            if(key === '0'){
                const chartAtZero = chart[0]
                for(const valuePropertyName of Object.getOwnPropertyNames(value)){
                    if(/^\d+$/.test(valuePropertyName)){
                        result[valuePropertyName] = serializeEvent((value as any)[valuePropertyName], chartAtZero)
                    }
                }
                continue;
            }
            result[key] = serializeEvent((value as any)[key], chart[key])
        }
        return result;
}