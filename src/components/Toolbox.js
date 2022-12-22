import { Button, ButtonGroup, Container, Form } from 'react-bootstrap'
import styled, { css } from 'styled-components'

import { BsBrush, BsEraser } from 'react-icons/bs'
import { TfiStamp } from 'react-icons/tfi'
import { FiDroplet } from 'react-icons/fi'
import { BiImageAdd } from 'react-icons/bi'
import { useRecoilState, useRecoilValue } from 'recoil'
import { toolTypeState, brushSizeState, brushColorState } from '../state/tool'
import { useState } from 'react'
import { getIsMobile } from '../utils'

const BUTTON_SIZE = 60
const StyledContainer = styled(Container)`
    width: ${BUTTON_SIZE}px;
    padding: 0;
    background-color: #f8f9fa;
    & > div {
        width: 100%;
        border-radius: 0;
        & > button {
            border-radius: 0;
            height: ${BUTTON_SIZE}px;
            font-size: 1.4rem;
        }
    }

    @media screen and (max-width: 767px) {
        width: 100%;
        height: ${BUTTON_SIZE}px;
    }
`

const ToolList = [
    {
        name: 'brush',
        Icon: BsBrush,
    },
    {
        name: 'eraser',
        Icon: BsEraser,
    },
    // {
    //     name: 'stamp',
    //     Icon: TfiStamp,
    // },
    {
        name: 'blur',
        Icon: FiDroplet,
    },
    // {
    //     name: 'add-image',
    //     Icon: BiImageAdd,
    // },
]

const StyledSizeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
`
const getWidth = ({ width, height }) =>
    css`
        width: ${width / 2}px;
        height: ${height / 2}px;
    `
const StyledSizeIcon = styled.div`
    ${getWidth}
    background-color: #000;
    border-radius: 100%;
`
const StyledButton = styled(Button)`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & > span {
        font-size: 0.8rem;
    }
`
const StyledControllerSection = styled.div`
    position: absolute;
    left: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    width: 180px;
    height: 60px;
    background-color: #f8f9fa;

    border: 1px solid #c8c9ca;
    z-index: 3;
    cursor: default;

    @media screen and (max-width: 767px) {
        position: fixed;
        left: 0px;
        bottom: ${BUTTON_SIZE}px;
    }
`

const StyledSizeControllerSection = styled(StyledControllerSection)`
    width: 180px;
    height: 60px;
    @media screen and (max-width: 767px) {
        width: 100vw;
        height: ${BUTTON_SIZE}px;
    }
`
const SizeControllerSection = () => {
    const [size, setSize] = useRecoilState(brushSizeState)
    const handleClick = (e) => {
        e.stopPropagation()
    }
    const handleChange = (e) => {
        setSize(e.target.value)
    }
    return (
        <StyledSizeControllerSection>
            <Form.Range
                onClick={handleClick}
                value={size}
                onChange={handleChange}
                min={4}
                max={50}
            />
        </StyledSizeControllerSection>
    )
}
const SizeController = () => {
    const [isOpen, toggle] = useState(false)
    const size = useRecoilValue(brushSizeState)
    return (
        <StyledButton variant="light" onClick={() => toggle(!isOpen)}>
            {isOpen && <SizeControllerSection />}
            <StyledSizeContainer>
                <StyledSizeIcon width={size} height={size} />
            </StyledSizeContainer>
            <span>{size}</span>
        </StyledButton>
    )
}

const ColorController = () => {
    const [color, setColor] = useRecoilState(brushColorState)
    const handleChange = (e) => setColor(e.target.value)

    return (
        <StyledButton variant="light">
            <Form.Control
                type="color"
                id="exampleColorInput"
                defaultValue="#563d7c"
                title="Choose your color"
                value={color}
                onChange={handleChange}
            />
        </StyledButton>
    )
}

const ToolButton = ({ name, Icon }) => {
    const [toolType, setToolType] = useRecoilState(toolTypeState)
    const handleClick = () => setToolType(name)
    return (
        <Button
            variant="light"
            onClick={handleClick}
            active={toolType === name}
        >
            <Icon />
        </Button>
    )
}
const Toolbox = () => {
    const isMobile = getIsMobile()
    return (
        <StyledContainer>
            <ButtonGroup vertical={!isMobile}>
                {ToolList.map((item) => (
                    <ToolButton key={item.name} {...item} />
                ))}
                <SizeController />
                <ColorController />
            </ButtonGroup>
        </StyledContainer>
    )
}

export default Toolbox
