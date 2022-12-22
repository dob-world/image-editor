import { atom } from 'recoil'

export const canvasState = atom({
    key: '@image/canvas',
    default: undefined,
})

export const originImageState = atom({
    key: '@image/origin-image',
    default: undefined,
})

export const previewImagePathState = atom({
    key: '@image/preview-image-path',
    default: undefined,
})
export const maskPathState = atom({
    key: '@image/mask-path',
    default: undefined,
})

export const alignedImagePathState = atom({
    key: '@image/aligned-image-path',
    default: undefined,
})
