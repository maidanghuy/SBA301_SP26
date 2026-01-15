import Carousel from "react-bootstrap/Carousel";
import banners from "../data/banner";

function BannerCarousel() {
  return (
    <Carousel interval={3000} pause="hover" fade>
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            className="d-block w-100"
            src={banner.image}
            alt={banner.title}
            style={{ height: "400px", objectFit: "cover" }}
          />

          <Carousel.Caption>
            <h3 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {banner.title}
            </h3>
            <p style={{ fontSize: "1.2rem" }}>{banner.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BannerCarousel;
