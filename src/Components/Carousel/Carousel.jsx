import React from 'react'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import { img } from './img/data'
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Carousel() {
  return (
    <div>
      <ResponsiveCarousel
            autoPlay={true}
            infiniteLoop={true}
            showIndicators={false}
            showThumbs={false}
            // showStatus={false}
            // interval={3000}
        >
        {
            img.map((imageItemLink, index) => {
                return <img key={index} src={imageItemLink} alt={`Carousel ${index + 1}`} />   
            })
        }
        </ResponsiveCarousel>
    </div>
  )
}

export default Carousel;
