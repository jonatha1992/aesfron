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
    const cursosCount = array ? array.length : 0;

    const settings = {
        dots: false,
        infinite: cursosCount > 2,
        speed: 500,
        slidesToShow: cursosCount === 2 ? 2 : 3,
        slidesToScroll: cursosCount === 2 ? 2 : 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: cursosCount === 2 ? 2 : 3,
                    slidesToScroll: cursosCount === 2 ? 2 : 2,
                    infinite: cursosCount > 2,
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
        // prevArrow: <CustomPrevArrow />,
        // nextArrow: <CustomNextArrow />,
    };

    if (cursosCount === 1) {
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
            <div className={`col-12 ${cursosCount === 2 ? "col-md-8" : ""}`}>
                <Slider {...settings}>
                    {array.map((item, index) => (
                        <div key={index} className={`px-2 ${cursosCount === 2 ? "col-md-6" : ""}`}>
                            <CardCurso item={item} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default SliderCursosLanding;
