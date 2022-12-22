import { useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

const ResizeDot = ({ image, dotInfo, box, setBox, setMouse }) => {
    const mouseDown = (e) => {
        const nextMouse = {
            action: dotInfo.cursor,
            preLeft: box.left,
            preWidth: image.width,
            preTop: box.top,
            preHeight: image.height,
            x: e.clientX,
            y: e.clientY,
        }
        setMouse(nextMouse)

        const move = (e) => mouseMove(e, nextMouse)

        window.addEventListener('mousemove', move)
        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', move)
            mouseUp()
        })
    }

    const mouseMove = (e, mouse) => {
        if (!mouse.action.includes('resize')) return
        const direction = mouse.action.split('-')[0]

        let left = mouse.preLeft,
            top = mouse.preTop,
            width = mouse.preWidth,
            height = mouse.preHeight
        if (direction.includes('n')) {
            top = mouse.preTop + e.clientY - mouse.y
            height = mouse.preHeight + mouse.y - e.clientY
        }

        if (direction.includes('s')) {
            height = mouse.preHeight + e.clientY - mouse.y
        }

        if (direction.includes('w')) {
            left = box.left + e.clientX - mouse.x
            width = mouse.preWidth + mouse.x - e.clientX
        }

        if (direction.includes('e')) {
            width = mouse.preWidth + e.clientX - mouse.x
        }

        setBox({
            ...box,
            left: left,
            top: top,
            width: width,
            height: height,
        })
    }

    const mouseUp = () => setMouse({ action: '' })

    return (
        <div
            className={'ResizeDot'}
            style={{
                left: `${dotInfo.left}%`,
                top: `${dotInfo.top}%`,
                cursor: dotInfo.cursor,
            }}
            onMouseDown={mouseDown}
        />
    )
}

const ContentImage = ({ reff, image, box, mouse, setBox, setMouse }) => {
    const mouseDown = (e) => {
        setMouse({
            action: 'move',
            preLeft: box.left,
            preTop: box.top,
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        })
    }

    const mouseMove = (e) => {
        if (mouse.action !== 'move') return
        const left = box.left + e.nativeEvent.offsetX - mouse.x
        const top = box.top + e.nativeEvent.offsetY - mouse.y
        setBox({
            ...box,
            left: left,
            top: top,
        })
    }

    const mouseUp = () => setMouse({ action: '' })

    return (
        <img
            className={'moveImage'}
            style={{
                width: box.width,
                height: box.height,
            }}
            ref={reff}
            src={image}
            alt=""
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
            onMouseUp={mouseUp}
        />
    )
}

export default function CropImage({ image, paste }) {
    const ref = useRef(null)

    const [box, setBox] = useState({
        left: 100,
        top: 100,
    })
    const [mouse, setMouse] = useState({ action: '' })

    const dotPos = []

    const cursor_list = ['nw', 'w', 'sw', 'n', 's', 'ne', 'e', 'se']
    let idx = 0
    for (let i = 0; i <= 100; i += 50) {
        for (let j = 0; j <= 100; j += 50) {
            if (i === 50 && j === 50) continue
            dotPos.push({
                left: i,
                top: j,
                cursor: `${cursor_list[idx]}-resize`,
            })
            idx++
        }
    }

    return (
        <div
            className={'cropImageContainer'}
            style={{
                left: box.left,
                top: box.top,
            }}
        >
            <ContentImage
                reff={ref}
                image={image}
                box={box}
                setBox={setBox}
                mouse={mouse}
                setMouse={setMouse}
            />
            {dotPos.map((info) => (
                <ResizeDot
                    key={`left_${info.left}_top_${info.top}`}
                    image={ref.current}
                    dotInfo={info}
                    mouse={mouse}
                    setMouse={setMouse}
                    box={box}
                    setBox={setBox}
                />
            ))}

            <button
                className={'PasteButton'}
                onClick={() => paste(ref.current, box)}
            >
                <FaCheck />
            </button>
        </div>
    )
}
