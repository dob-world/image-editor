import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { runInference, SERVER_URL } from '../api/image'
import { drawPoint, putImageData, removeFunc } from '../canvas/func'
import {
    alignedImagePathState,
    canvasState,
    maskPathState,
    originImageState,
    previewImagePathState,
} from '../state/image'
import { isDownState } from '../state/mouse'
import {
    brushColorState,
    brushSizeState,
    canvasOriginImageState,
    toolTypeState,
} from '../state/tool'

export const useCanvas = () => {
    const setCanvasState = useSetRecoilState(canvasState)
    const canvasRef = useRef(null)
    useEffect(() => {
        setCanvasState(canvasRef)
    }, [setCanvasState])
    return canvasRef
}
export const useMouseEvent = () => {
    const [isDown, toggleDown] = useRecoilState(isDownState)
    const tool = useRecoilValue(toolTypeState)
    const pointWidth = useRecoilValue(brushSizeState)
    const color = useRecoilValue(brushColorState)
    const maskPath = useRecoilValue(maskPathState)
    const alignedPath = useRecoilValue(alignedImagePathState)
    const [tempImage, setTempImage] = useRecoilState(brushColorState)
    const [originImage, setOriginImage] = useRecoilState(originImageState)
    const canvasOriginImage = useRecoilValue(canvasOriginImageState)
    const setPreviewImagePath = useSetRecoilState(previewImagePathState)
    const canvasRef = useRecoilValue(canvasState)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: runInference,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['preview-images'] })
            const previewPath = `${SERVER_URL}/static/inference/${res.data.uuid_name}.png`
            setPreviewImagePath(previewPath)
        },
    })

    const onMouseDown = (e) => {
        if (e.type === 'touchstart') e.stopPropagation()
        toggleDown(true)
        const canvas = e.target
        const ctx = canvas.getContext('2d')
        ctx.lineWidth = pointWidth
        ctx.lineCap = 'round'
        ctx.strokeStyle = color
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY
        if (tool === 'stamp') {
            setTempImage(
                ctx.getImageData(
                    x - pointWidth / 2,
                    y - pointWidth / 2,
                    pointWidth,
                    pointWidth,
                ),
            )
        } else if (tool === 'blur') {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvas.width
            tempCanvas.height = canvas.height
            const tempCtx = tempCanvas.getContext('2d')
            tempCtx.filter = 'blur(4px)'
            tempCtx.drawImage(ctx.canvas, 0, 0)
            setTempImage(
                tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height),
            )
        }
    }

    const onMouseMove = (e) => {
        let x, y
        if (e.type === 'touchmove') {
            e.stopPropagation()
            const bcr = e.target.getBoundingClientRect()
            x = e.targetTouches[0].clientX - bcr.x
            y = e.targetTouches[0].clientY - bcr.y
        } else {
            x = e.nativeEvent.offsetX
            y = e.nativeEvent.offsetY
        }
        // const cursor = cursorRef.current
        // requestAnimationFrame(() => {
        //     if (!cursor) return
        //     cursor.style.transform = `translate(${x - pointWidth / 2}px, ${
        //         y - pointWidth / 2
        //     }px)`
        // })
        if (!isDown) return
        const ctx = e.target.getContext('2d')
        if (tool === 'brush') {
            requestAnimationFrame(() => {
                drawPoint(ctx, x, y)
            })
        } else if (tool === 'eraser') {
            requestAnimationFrame(() => {
                putImageData(
                    ctx,
                    canvasOriginImage,
                    x,
                    y,
                    pointWidth / 2,
                    pointWidth / 2,
                    pointWidth,
                )
            })
        } else if (tool === 'stamp') {
            requestAnimationFrame(() => {
                putImageData(
                    ctx,
                    tempImage,
                    x,
                    y,
                    pointWidth / 2,
                    pointWidth / 2,
                    pointWidth,
                )
            })
        } else if (tool === 'blur') {
            requestAnimationFrame(() => {
                putImageData(ctx, tempImage, x, y, x, y, pointWidth)
            })
        }
    }
    const onMouseUp = (e) => {
        if (e.type === 'touchend') e.stopPropagation()
        toggleDown(false)
        // 이미지 생성 부분 추가
        const imageUrl = canvasRef.current.toDataURL()
        // const ratios = {
        //     original: latentsRatio.original / 100,
        //     edited: latentsRatio.edited / 100,
        //     man: latentsRatio.man / 100,
        //     baby: latentsRatio.baby / 100,
        // }

        mutation.mutate({
            image: imageUrl,
            mask_path: maskPath,
            aligned_path: alignedPath,
        })
    }
    const onMouseEnter = () => {}
    const onMouseOut = () => {
        toggleDown(false)
    }
    return {
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseEnter,
        onMouseOut,
        onTouchStart: onMouseDown,
        onTouchMove: onMouseMove,
        onTouchEnd: onMouseUp,
    }
}
