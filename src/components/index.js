import { Suspense, useState } from 'react'
import { Button } from 'react-bootstrap'
import styled, { css } from 'styled-components'
import { getIsMobile } from '../utils'
import Editor from './Editor'
import Header from './Header'
import Preview from './Preview'
import Toolbox from './Toolbox'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
`

const StyledStack = styled.div`
    flex: 1;
    display: flex;
    ${({ isMobile }) =>
        !isMobile
            ? css`
                  flex-direction: row;
              `
            : css`
                  flex-direction: column;
              `}
`

const MobileImageContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const ModeButton = styled(Button)`
    border-radius: 0;
    font-weight: 500;
`
const MobileLayout = () => {
    const [mode, setMode] = useState('editor')
    const toggleMode = () => setMode(mode === 'editor' ? 'preview' : 'editor')
    const hiddenStyle = { display: 'none' }
    return (
        <>
            <MobileImageContainer>
                <Editor style={mode === 'preview' ? hiddenStyle : {}} />
                <Preview style={mode === 'editor' ? hiddenStyle : {}} />
            </MobileImageContainer>

            <ModeButton onClick={toggleMode} variant="light">
                {mode === 'editor' && '변환'}
                {mode === 'preview' && '돌아가기'}
            </ModeButton>
            <Toolbox />
        </>
    )
}

const DesktopLayout = () => {
    return (
        <>
            <Toolbox />
            <Editor />
            <Preview />
        </>
    )
}
const IndexComponent = () => {
    const isMobile = getIsMobile()

    return (
        <Suspense fallback={<div>asdfsadf</div>}>
            <Container>
                <Header />
                <StyledStack isMobile={isMobile}>
                    {isMobile ? <MobileLayout /> : <DesktopLayout />}
                </StyledStack>
            </Container>
        </Suspense>
    )
}

export default IndexComponent
