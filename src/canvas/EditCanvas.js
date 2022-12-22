import React, { useEffect } from 'react'
import { useRef } from 'react'

import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { brushSizeState } from '../state/tool'
import { useResizeCanvas } from './func'
import { useCanvas, useMouseEvent } from '../hook/canvas'

const CanvasContainer = styled.div`
    border: 1px solid #888;
    & > canvas {
        position: absolute;
    }
    .editCanvas {
        /* cursor: none; */
    }
    .canvasCursor {
        position: absolute;
        left: 0;
        top: 0;

        border-radius: 100%;
        background-color: transparent;
        border: 1px solid #000;

        mix-blend-mode: color-burn;
        z-index: 10;
        cursor: none;
        pointer-events: none;
    }

    .faceView {
        flex: 1;
        align-items: center;
        justify-content: space-evenly;
    }
    .faceView > * {
        width: 30vw;
        height: 30vw;

        max-width: 512px;
        max-height: 512px;
    }
`
// 중점은 dirtyX, dirtY
// 반지름은 dirtyWidth

const Cursor = ({ reff, isCursor }) => {
    const pointWidth = useRecoilValue(brushSizeState)
    if (!isCursor) return <></>

    return (
        <div
            ref={reff}
            className={'canvasCursor'}
            style={{
                width: Number(pointWidth),
                height: Number(pointWidth),
            }}
        ></div>
    )
}

function EditCanvas({ image, act }) {
    const canvasRef = useCanvas()
    useResizeCanvas(canvasRef)

    return (
        <CanvasContainer>
            <canvas
                className="editCanvas"
                {...useMouseEvent()}
                ref={canvasRef}
            />

            {/* <Cursor
                reff={cursorRef}
                isCursor={isCursor}
                pointWidth={pointWidth}
            /> */}

            {/* {cropImage && (
                <CropImage
                    image={cropImage}
                    paste={(image, box) => {
                        const ctx = canvasRef.current.getContext('2d')
                        ctx.drawImage(
                            image,
                            box.left,
                            box.top,
                            image.width,
                            image.height,
                        )
                        setCropImage(null)
                    }}
                />
            )} */}
        </CanvasContainer>
    )
}

export default EditCanvas
