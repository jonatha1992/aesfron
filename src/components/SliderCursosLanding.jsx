import React from "react";
import Slider from "react-slick";
import CardCurso from "./CardCurso";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slick.css";

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

    const array = cursos.cursos;
    const hay1Curso = array && array.length === 1;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: hay1Curso ? 1 : 3,
        slidesToScroll: hay1Curso ? 1 : 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: hay1Curso ? 1 : 3,
                    slidesToScroll: hay1Curso ? 1 : 2,
                    infinite: true,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: hay1Curso ? 1 : 2,
                    slidesToScroll: hay1Curso ? 1 : 2,
                    initialSlide: hay1Curso ? 0 : 2,
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
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };

    if (hay1Curso) {
        return (
            <div className="slider-container d-flex justify-content-center">
                <div className="col-12 col-md-4">
                    <CardCurso item={array[0]} />
                </div>
            </div>
        );
    }

    return (
        <div className="slider-container d-flex justify-content-center">
            <div className="col-12">
                <Slider {...settings}>
                    {array.map((item, index) => (
                        <CardCurso key={index} item={item} />
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default SliderCursosLanding;
