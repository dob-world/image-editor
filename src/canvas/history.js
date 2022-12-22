
export function act(history, id){
    const [ids, pointer] = history
    const new_ids = [...ids.slice(0, pointer+1), id]
    return [new_ids, pointer+1]
}

export function undo(history){
    const [ids, pointer] = history
    if(pointer <= 0) return history
    return [ids, pointer-1]
}

export function redo(history){
    const [ids, pointer] = history
    if(pointer+1 >= ids.length) return history
    return [ids, pointer+1]
}