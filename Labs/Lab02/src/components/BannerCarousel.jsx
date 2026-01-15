import Carousel from "react-bootstrap/Carousel";
import banners from "../data/banner";
import "./BannerCarousel.css";

function BannerCarousel() {
  return (
    <Carousel interval={3000} pause="hover" fade>
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            className="d-block w-100 banner-img"
            src={banner.image}
            alt={banner.title}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
          />
          <Carousel.Caption>
            <h3 className="banner-title">{banner.title}</h3>
            <p className="banner-desc">{banner.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BannerCarousel;
