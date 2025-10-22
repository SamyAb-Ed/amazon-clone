import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { img } from "../../assets/Images/img/data";
import classes from "./Carousel.module.css";

const CarouselEffect = () => {
  return (
    <div>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
        interval={3000}
        transitionTime={500}
      >
        {img.map((imageItemLink, index) => {
          return (
            <div key={index}>
              <img
                src={imageItemLink}
                alt={`Carousel image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  console.error(
                    `Failed to load carousel image ${index + 1}:`,
                    imageItemLink
                  );
                  e.target.style.display = "none";
                }}
              />
            </div>
          );
        })}
      </Carousel>
      <div className={classes.hero_img}></div>
    </div>
  );
};

export default CarouselEffect;
