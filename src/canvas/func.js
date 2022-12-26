import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { originImageState } from '../state/image'
import { canvasOriginImageState } from '../state/tool'

export const repaint = (ctx, image, canvas) => {
    ctx.clearRect(0, 0, 2000, 2000)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

export const drawPoint = (ctx, x, y) => {
    console.log(x, y, 'draw!')
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
}

export const removeFunc = (ctx, x, y, pointWidth) => {
    ctx.clearRect(x, y, pointWidth, pointWidth)
}

export const useResizeCanvas = (ref) => {
    const originImage = useRecoilValue(originImageState)
    const setCanvasOriginImage = useSetRecoilState(canvasOriginImageState)
    useEffect(() => {
        const canvas = ref.current
        if (!canvas) {
            console.error('resize err')
            return
        }
        const { width, height } = canvas.parentElement.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(originImage, 0, 0, canvas.width, canvas.height)
        setCanvasOriginImage(
            ctx.getImageData(0, 0, canvas.width, canvas.height),
        )
    }, [ref, originImage, setCanvasOriginImage])
}
export function putImageData(
    ctx,
    imageData,
    dx,
    dy,
    dirtyX,
    dirtyY,
    dirtyWidth,
) {
    var data = imageData.data
    var width = imageData.width
    dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width
    const unit = Math.round(dirtyWidth / 2)

    for (var y = -unit; y < unit; y++) {
        for (var x = -unit; x < unit; x++) {
            if (x * x + y * y > Math.pow(unit, 2)) continue
            const pos_x = x + dx
            const pos_y = y + dy
            var pos = Math.round(pos_y * width + pos_x)
            ctx.fillStyle =
                'rgba(' +
                data[pos * 4 + 0] +
                ',' +
                data[pos * 4 + 1] +
                ',' +
                data[pos * 4 + 2] +
                ',' +
                data[pos * 4 + 3] / 255 +
                ')'
            ctx.fillRect(dx + x, dy + y, 1, 1)
        }
    }
}
