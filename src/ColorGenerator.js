import styled from "styled-components";
import {useEffect, useState} from "react";

const Color = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.color};
  color: ${props => props.color};
`;

const Code = styled.div`
  font-size: 2.5rem;
  font-weight: 100;
  letter-spacing: 5px;
  display: flex;
  justify-content: center;
  position: relative;
  top: 50%;
  cursor: pointer;
  background-color: white;
  width: fit-content;
  margin: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;

  animation-name: ${props => props.animationName};
  animation-duration: 1s;
  
  @keyframes pulse {
    0% {
      opacity: 0.9;
    }
    30% {
      opacity: 0.8;
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
    }
  }
`;

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  position: relative;
  top: 50%;
  background-color: rgba(255, 255, 255, 0.80);
  width: fit-content;
  margin: 10px auto;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
`;

const CBMessage = styled.div`
  background-color: white;
  font-weight: 400;
  width: fit-content;
  font-size: 1rem;
  border-radius: 5px;
  color: ${props => props.color};
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  position: relative;
  bottom: ${props => props.show ? '100px' : '110px'};
  margin: auto;
  animation-name: comeDown;
  opacity: ${props => props.show ? '0.75' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.5s ease-in-out;
`;

const SpaceMessage = styled.div`
  font-weight: 100;
  width: fit-content;
  font-size: 2rem;
  color: white;
  display: flex;
  justify-content: center;
  margin: auto;
  position: relative;
  top: 400px;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`;

const CHARS = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F'
];

const ColorGenerator = () => {
    const [color, setColor] = useState('#247762');
    const [name, setName] = useState('');
    const [animationName, setAnimationName] = useState('none');
    const [showSpaceMessage, setShowSpaceMessage] = useState(true);
    const [showClipboardMessage, setShowClipboardMessage] = useState(false);
    const [showId, setShowId] = useState();

    const randomColorGenerator = (e) => {
        const randomNumber = (min = 0, max = CHARS.length) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        if (e.code === 'Space') {
            clearTimeout(showId);
            setShowSpaceMessage(false);
            let str = '#';
            for (let i = 0; i < 6; i++) {
                str = str.concat(CHARS[randomNumber()]);
            }
            setColor(str);
            setShowId(setTimeout(() => {
                setShowSpaceMessage(true);
            }, 5000));
        }

    }

    const codeClickHandler = () => {
        setAnimationName('pulse');
        navigator.clipboard.writeText(color)
            .then(() => setShowClipboardMessage(true));
        setTimeout(() => {
            setAnimationName('none');
            setShowClipboardMessage(false);
        }, 2000);
    }

    useEffect(() => {
        let colorClean = color.replace('#', '');
        fetch(`https://www.thecolorapi.com/id?hex=${colorClean}`)
            .then(res => res.json())
            .then(data => setName(data.name.value));
    }, [color])

    return (
        <>
            <Color onKeyDown={randomColorGenerator} color={color} tabIndex={0}>
                <Code title={'Click to Copy!'} onClick={codeClickHandler} animationName={animationName}>{color}</Code>
                <Name>{name}</Name>
                <CBMessage color={color} show={showClipboardMessage}>Copied to Clipboard!</CBMessage>
                <SpaceMessage show={showSpaceMessage}>Press 'Space' to Generate!</SpaceMessage>
            </Color>
        </>
    );
}

export default ColorGenerator;