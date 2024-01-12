import React, { useEffect, useContext } from "react";
import GlobalStyle from "../styles/GlobalStyle";
import { ReactComponent as Logo } from "../assets/logo.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import axios from "axios";

function LoadingPage(props) {
  const navigate = useNavigate();

  const { description, setDescription, translatedDescription, setTransalteDescription } =
    useContext(ImageContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://www.seunghan.shop/image_to_text",
          "data.jpg",
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        setDescription(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  /* 영어 한글로 번역하는 부분 */
  useEffect(() => {
    const translateRequest = async () => {
      try {
        const encodedDescription = encodeURIComponent(description);
        const response = await axios.get(
          `https://www.seunghan.shop/translate?prompt=${encodedDescription}`
        );
        console.log("GET 요청 성공:", response.data);
        setTransalteDescription(response.data.image_url);
      } catch (error) {
        console.error("GET 요청 실패:", error);
      }
    };

    if (description) {
      translateRequest();
    }
  }, [description]);

  useEffect(() => {
    if (translatedDescription) {
      navigate(`/showTwoPictures`);
      const textToRead =
        "사진이 분석되었습니다. 설명은 다음과 같습니다.";
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const descriptionUtterance = new SpeechSynthesisUtterance(translatedDescription);
      utterance.rate = 0.9; // 음성 속도 설정
      synth.speak(utterance); // 음성 재생
      synth.speak(descriptionUtterance); // 음성 재생
    }
  }, [translatedDescription, navigate]);

  return (
    <>
      <GlobalStyle />
      <MainPageDiv>
        <StyledLogo />
        <FirstText>
          사진을 분석하고 있습니다.
          <br />. . .
          <br />
          잠시만 기다려주세요.
        </FirstText>
      </MainPageDiv>
    </>
  );
}

const MainPageDiv = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLogo = styled(Logo)`
  width: 100%;
  margin-bottom: 40px;
`;

const FirstText = styled.div`
  color: white;
  font-size: x-large;
  font-weight: bold;
  text-align: center;
  margin: 20px;
  line-height: 3;
`;

export default LoadingPage;