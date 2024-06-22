import React from "react";
import Slider from "react-slick";
import CardCurso from "./CardCurso";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slick.css";
import { colors } from "@mui/material";
import { blue } from "@mui/material/colors";

function SliderCursosLanding({ cursos }) {
  const CustomPrevArrow = (props) => (
    <button {...props} className="slick-arrow slick-prev">
      <ArrowBack fontSize="large" />
    </button>
  );

  const CustomNextArrow = (props) => (
    <button {...props} className="slick-arrow slick-next">
      <ArrowForward fontSize="large" />
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    /* prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />, */
  };

  const array = cursos.cursos;

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {array.map((item, index) => (
          <CardCurso key={index} item={item} />
        ))}
      </Slider>
    </div>
  );
}

export default SliderCursosLanding;
