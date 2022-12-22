import { useEffect, useRef, useState, useContext } from 'react';

import { MakeFaceContext } from "."

import style from './ImageCropTool.module.css'
import { MdFileUpload } from 'react-icons/md';
import { FlexDiv } from '../common/Layout';

function initCanvas(canvasRef, image) {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 0.3 < 512 ? window.innerWidth * 0.3 : 512
    canvas.height = window.innerWidth * 0.3 < 512 ? window.innerWidth * 0.3 : 512

    const ctx = canvas.getContext('2d')

    const img = new Image(); //이미지 객체 생성
    img.src = image;
    img.crossOrigin = "Anonymous";
    img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    })
}


const ImageCanvas = ({ image, toggleOpen, setImage}) => {

    const ref = useRef(null)

    const { setCropImage } = useContext(MakeFaceContext);
    const [mouse, setMouse] = useState({ isDown: false })
    useEffect(() => initCanvas(ref, image), [image])

    const left = Number(Math.min(mouse.x, mouse.x2))
    const top = Number(Math.min(mouse.y, mouse.y2))
    const width = Math.abs(mouse.x - mouse.x2)
    const height = Math.abs(mouse.y - mouse.y2)

    const mouseDown = (e) => setMouse({
        isDown: true,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        x2: e.nativeEvent.offsetX,
        y2: e.nativeEvent.offsetY,
    })

    const mouseMove = (e) => {
        if (!mouse.isDown) return
        setMouse({
            ...mouse,
            x2: e.nativeEvent.offsetX,
            y2: e.nativeEvent.offsetY
        })
    }

    const mouseUp = () => {
        if (Math.abs(mouse.x - mouse.x2) +
            Math.abs(mouse.y - mouse.y2) < 20) {
            setMouse({
                ...mouse,
                isDown: false,
                x2: false
            })
        } else {
            setMouse({ ...mouse, isDown: false })
        }
    }

    const dragBoxStyle = {
        left: left,
        top: top,
        width: width,
        height: height,
    }

    const submit = () => {
        const ctx = ref.current.getContext('2d')
        const image = ctx.getImageData(left, top, width, height)
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = image.width
        tempCanvas.height = image.height
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.putImageData(image, 0, 0)
        setCropImage(tempCanvas.toDataURL())
        toggleOpen(false)
    }


    return (
        <FlexDiv className={style.ImageCanvas}>
            <canvas ref={ref}
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp} />

            {mouse.x2 &&
                <div className={style.dragBox}
                    style={dragBoxStyle}
                />}
            <FlexDiv className={style.ImageCanvasButtonContainer}>
                <UploadButton setImage={setImage} change={true}/>
                <button className={[style.submitButton,
                mouse.x2 ? '' : style.disable].join(' ')}
                    onClick={submit}>
                    입력하기
                </button>
            </FlexDiv>
        </FlexDiv>
    )
}

const UploadButton = ({ setImage, change }) => {

    const selectImage = () => {
        const f = document.createElement('input')
        f.type = 'file'
        f.addEventListener('change', (e) => {
            const file = e.target.files[0]
            const fileReader = new FileReader()
            if (file.type.match('image')) {
                fileReader.onload = () => {
                    setImage(fileReader.result)
                }
                fileReader.readAsDataURL(file)
            }
        })
        f.click()
    }

    if (change) {
        return (
            <button className={style.submitButton}
                onClick={selectImage}>
                이미지 고르기
            </button>
        )
    }
    return (
        <button className={style.uploadButton}
            onClick={selectImage}>
            <MdFileUpload className={style.uploadIcon} />
            <p>복사할 내용을 포함하는 이미지를 업로드해주세요.</p>
        </button>
    )
}


export default function ImageCropTool({ isOpen, toggleOpen }) {

    const [image, setImage] = useState(null)

    return (
        <FlexDiv className={[style.imageCropToolContainer, isOpen ? style.open : ''].join(' ')}>
            {image ?
                <ImageCanvas
                    image={image}
                    toggleOpen={toggleOpen}
                    setImage={setImage} /> :
                <UploadButton
                    setImage={setImage} />}

        </FlexDiv>
    )
}