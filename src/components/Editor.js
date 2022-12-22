import { StyledContainer } from './Preview'

import EditCanvas from '../canvas/EditCanvas'
import { useRecoilValue } from 'recoil'
import { originImageState } from '../state/image'
import { useSetImage } from '../hook/image'
import { Suspense } from 'react'
import styled from 'styled-components'

const StyledLoader = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: #888;
`
const Loader = () => {
    return (
        <StyledLoader>
            ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ
        </StyledLoader>
    )
}

const ImageSelector = () => {
    const { handleClick } = useSetImage()

    return (
        <Suspense fallback={<Loader />}>
            <div onClick={handleClick}>
                <div>이미지를 선택해주세요.</div>
            </div>
        </Suspense>
    )
}

const Editor = ({ style }) => {
    const image = useRecoilValue(originImageState)
    return (
        <StyledContainer style={style}>
            {image && <EditCanvas />}
            {!image && <ImageSelector />}
        </StyledContainer>
    )
}

export default Editor
