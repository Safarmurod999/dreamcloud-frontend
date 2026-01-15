import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import Button from "../../components/Button/Button";
import arrow from "../../assets/icons/arrow.svg";
import range from "../../assets/icons/range.svg";
import bed from "../../assets/images/home/home-main.png";
import video from "../../assets/videos/about-video.mp4";
import showroom from "../../assets/images/home/showroom.png";
import geolocation from "../../assets/icons/geolocation.svg";
import address_img from "../../assets/images/home/address.png";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import AddressModal from "../../components/AddressModal/AddressModal";
import { postData } from "../../utils/postData";
import BackTop from "../../components/BackTop/BackTop";
import OrderModal from "../../components/OrderModal/OrderModal";
import { BASE_URL, features } from "../../data/data";
import "./Home.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Spinner from "../../components/Spinner/Spinner";
// import { IoPauseCircleSharp } from "react-icons/io5";
import { IoIosPlayCircle } from "react-icons/io";

function Home() {
  const [active, setActive] = useState(0);
  const [contact, setContact] = useState("");
  const [productData, setProductData] = useState({});

  const { data: categories, loading: loading1 } = useFetch("categories");
  const { data: products, loading: loading2 } = useFetch("products");
  const { data: technologies, loading: loading3 } = useFetch("technologies");
  const { data: addresses, loading: loading4, error } = useFetch("addresses");

  function videoControl(id) {
    const video = document.getElementById(`${id}`);
    const videos = document.getElementsByClassName("video");
    let html = document.getElementById(`btn-${id}`);
    const htmls = document.getElementsByClassName("video--btn");
    if (video.paused) {
      for (const el of videos) {
        el.pause();
      }
      for (const el of htmls) {
        el.style.display = "flex";
      }
      video.play();
      html.style.display = "none";
    } else {
      video.pause();
      html.style.display = "flex";

    }
  }
  const modalControl = () => {
    document.querySelector(".modal").style.display = "flex";
  };
  const contactPost = (e) => {
    e.preventDefault();
    postData("customers", { mobile_phone: `+998${contact}` });
    setContact("");
  };  
  const orderControl = (data) => {
    setProductData(data);
    document.querySelector(".order").style.display = "flex";
    document.querySelector(".order__form").style.display = "block";
  };
  if (loading1 || loading2 || loading3 || loading4) {
    return <Spinner position={"full"} />;
  }
  if (error) {
    console.log(error);
  }
  return (
    categories &&
    products &&
    technologies &&
    addresses && (
      <main>
        <BackTop />
        <OrderModal data={productData} />
        <section className="home">
          <div className="container">
            <div className="home__left">
              <h1 className="home__title">Kechalari sokin dam oling</h1>
              <img className="home__main" src={bed} alt="bed" />
              <a href="#catalog">
                {" "}
                <Button title={"Kategoriyalar"} src={arrow} />
              </a>
              <img src={range} alt="range" />
            </div>
            <div className="home__right"></div>
          </div>
        </section>
        <section className="features">
          <div className="container">
            <ul className="features__list">
              <li className="features__list--item">
                <h3>7</h3>
                <p>yillik tajriba</p>
              </li>
              <li className="features__list--item">
                <h3>10k+</h3>
                <p>mamnun mijozlar</p>
              </li>
              <li className="features__list--item">
                <h3>10</h3>
                <p>yillik kafolat</p>
              </li>
              <li className="features__list--item">
                <h3>3</h3>
                <p>kunda yetkazish</p>
              </li>
            </ul>
          </div>
        </section>
        <section id="catalog" className="catalog">
          <div className="container">
            <div className="catalog__title title">Bizning mahsulotlar</div>
            <div className="catalog__tab">
              <ul className="catalog__tab--list">
                {categories.data
                  .sort((a, b) => a.id - b.id)
                  .map((el) => {
                    return (
                      <li
                        onClick={() => setActive(el.id)}
                        className={`catalog__tab--list--item ${
                          active == el.id && "active"
                        }`}
                        key={el.id}
                      >
                        {el.category_name}
                      </li>
                    );
                  })}
              </ul>
              <ul className="catalog__tab--panel">
                {products.data.filter(
                  (el) => el.category_id == active || active == 0
                ).length > 0 ? (
                  products.data.map((el) => {
                    if (el.category_id == active || active == 0) {
                      return (
                        <ProductCard
                          key={el.id}
                          {...el}
                          orderControl={() => orderControl(el)}
                        />
                      );
                    }
                  })
                ) : (
                  <div className="text-3xl">
                    Bunday toifadagi mahsulot hozirda mavjud emas.
                  </div>
                )}
              </ul>
            </div>
          </div>
        </section>
        {products.data.filter((el) => el.discount).length > 0 && (
          <section id="stock" className="stock">
            <div className="container">
              <div className="stock__title title">Aksiyadagi mahsulotlar</div>
              <ul className="stock--list">
                {products.data.map((el) => {
                  if (el.discount) {
                    return (
                      <ProductCard
                        key={el.id}
                        {...el}
                        orderControl={() => orderControl(el)}
                      />
                    );
                  }
                })}
              </ul>
            </div>
          </section>
        )}
        <section className="technologies">
          <div className="container">
            <div className="technologies__title title mb-[40px]">
              Ishlab chiqarish texnologiyalari
            </div>
            <Swiper
              spaceBetween={30}
              slidesPerView={3}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                678: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 3,
                },
              }}
              loop={true}
            >
              {technologies.data.map((el) => {
                return (
                  <SwiperSlide key={el.id}>
                    <div className="technologies--card">
                      <div className="technologies--card--title">{el.name}</div>
                      <div className="w-full flex items-center justify-center relative">
                        <video
                          src={`${BASE_URL}uploads/technologies/${el.video}`}
                          className="technologies--card--video video"
                          id={el.id}
                        ></video>
                        <div
                          className="technologies--card--btn"
                          onClick={() => videoControl(el.id)}
                        >
                          <div id={`btn-${el.id}`} className="video--btn">
                            <IoIosPlayCircle className="text-[76px]" />
                          </div>
                        </div>
                      </div>
                      <p className="technologies--card--description">
                        {el.description}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
        <section id="about" className="about">
          <div className="container">
            <div className="about__top">
              <div className="about__top--left">
                <div className="about__title title">
                  Dream Cloud kompaniyasi haqida
                </div>
                <p className="about__content text">
                  Penatibus viverra gravida rhoncus in. At turpis morbi ante
                  tortor a est. Habitant adipiscing ut sed pulvinar tellus, ut
                  urna, fermentum:
                </p>
                <ul className="about__list about__list--unordered">
                  <li className="about__list--item">
                    Penatibus viverra gravida rhoncus in.
                  </li>
                  <li className="about__list--item">
                    Dolor integer in interdum viverra risus dolor enim.
                  </li>
                  <li className="about__list--item">
                    Turpis senectus eu, eget aenean nulla pellentesque sed ut
                    tempor.
                  </li>
                </ul>
              </div>
              <div className="about__top--right">
                <video
                  src={video}
                  id="about__video"
                  className="about__video video"
                ></video>
                <div
                  className="about__video--btn"
                  onClick={() => videoControl("about__video")}
                >
                  <div id="btn-about__video" className="video--btn">
                    <IoIosPlayCircle className="text-[76px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="about__bottom">
              <div className="about__bottom--left">
                <img src={showroom} alt="showroom" />
              </div>
              <div className="about__bottom--right">
                <p className="about__content text">
                  Libero erat praesent ullamcorper eget tortor sed et. Nec id
                  lobortis gravida vitae. Scelerisque id fusce vitae ut. Integer
                  sed vulputate sed nec. Arcu id mattis erat et id.
                </p>
                <ol className="about__list about__list--ordered" start={1}>
                  <li className="about__list--item">
                    Id risus phasellus laoreet eget. A nec pulvinar.
                  </li>
                  <li className="about__list--item">
                    Eu justo, tincidunt fringilla diam nulla.
                  </li>
                  <li className="about__list--item">
                    Amet, nullam cras lacus, fermentum leo tellus sagittis.
                  </li>
                  <li className="about__list--item">
                    Facilisi mauris condimentum sagittis odio rhoncus semper.
                  </li>
                </ol>
                <p className="about__content text">
                  Ac tortor volutpat pellentesque mauris nisi, praesent. Et
                  tempus accumsan est elementum feugiat arcu mauris tincidunt.
                  Eget faucibus pharetra et luctus eget ut fames. A cursus
                  elementum egestas eu scelerisque id.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="advantages">
          <div className="container">
            <div className="advantages__title title">Nega bizni tanlashadi</div>
            <ul className="advantages__row">
              {features.map((el) => {
                return (
                  <li key={el.id} className="advantages__row--item">
                    <img src={el?.image} alt={el?.image} />
                    <div>{el.title}</div>
                    <p>{el.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <section id="address" className="address">
          <div className="container">
            <div className="address__left">
              <div className="address__title title">Manzilimiz</div>
              <img
                src={`https://dreamcloud-bac/uploads/addresses/${addresses.data[0]?.image}`}
                alt={address_img}
                className="address__left--img"
              />
              <h4 className="address--location">{addresses.data[0]?.address}</h4>
              <p className="address--destination text">
                {addresses.data[0]?.descrtiption}
              </p>
              <AddressModal src={addresses.data[0]?.location} />
              <Button
                title={"Geolokatsiya"}
                src={geolocation}
                callback={modalControl}
              />
            </div>
            <div className="address__right">
              <img
                src={`${BASE_URL}uploads/addresses/${addresses.data[0]?.image}`}
                alt={address_img}
              />
            </div>
          </div>
        </section>
        <section id="contact" className="contact">
          <div className="container">
            <div className="contact__left">
              <div className="contact__title title">Sizni qiziqtirdimi?</div>
              <p className="contact__text text">
                Raqamingizni qoldiring, biz sizga yana qo'ng'iroq qilamiz
              </p>
            </div>
            <div className="contact__right">
              <form className="contact__right--form form">
                <div className="form__input">
                  <span>+998 |</span>
                  <input
                    className="contact__input focus:ring-0"
                    placeholder="Raqamingizni yozing"
                    type="text"
                    onChange={(e) => setContact(e.target.value)}
                    value={contact}
                    required
                  />
                </div>
                <button
                  id="contact__submit"
                  type="submit"
                  onClick={(e) => {
                    contactPost(e);
                  }}
                >
                  Yuborish
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    )
  );
}

export default Home;