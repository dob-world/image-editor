import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { previewImagePathState } from '../state/image'
export const StyledContainer = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    & > canvas {
        border: 1px solid #888;
    }
    & > img,
    & > div {
        width: 80%;
        border: 1px solid #888;
    }
    & > div {
        padding-bottom: 80%;
        position: relative;
        & > div {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    @media screen and (max-width: 767px) {
        width: 100vw;
        & > img,
        & > div {
            width: 95%;
        }
        & > div {
            padding-bottom: 95%;
        }
    }
`

const Preview = ({ style }) => {
    const previewImagePath = useRecoilValue(previewImagePathState)
    return (
        <StyledContainer style={style}>
            <img
                src={previewImagePath}
                alt=""
                style={{ paddingBottom: previewImagePath ? 0 : '80%' }}
            />
        </StyledContainer>
    )
}

export default Preview
