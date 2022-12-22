import { atom } from 'recoil'

export const toolTypeState = atom({
    key: '@tool/type',
    default: 'brush',
})

export const brushColorState = atom({
    key: '@tool/brush/color',
    default: '#000000',
})

export const brushSizeState = atom({
    key: '@tool/brush/size',
    default: 20,
})

export const cropImageState = atom({
    key: '@tool/crop-image',
    default: undefined,
})

export const latentVectorState = atom({
    key: '@tool/latent-vector',
    default: undefined,
})

export const tmpeImageState = atom({
    key: '@tool/temp-image',
    default: undefined,
})

export const canvasOriginImageState = atom({
    key: '@tool/canvas-origin-image',
    default: undefined,
})
