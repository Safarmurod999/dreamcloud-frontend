import "./ProductCard.scss";
import cart from "../../assets/icons/shopping_cart.svg";
import Button from "../Button/Button";
import Fancybox from "../Fancybox/Fancybox";
import { BASE_URL } from "../../data/data";
function ProductCard({
  id,
  image,
  description,
  discount,
  product_name,
  overweight,
  guarantee,
  capacity,
  size,
  price,
  orderControl,
}) {
  return (
    <li className="catalog__tab--panel--item card">
      {discount > 0 && <div className="card--status">{discount}</div>}
      <div className="card--img">
        <Fancybox
          options={{
            Toolbar: {
              display: {
                left: ["infobar"],
                middle: [
                  "zoomIn",
                  "zoomOut",
                  "toggle1to1",
                  "rotateCCW",
                  "rotateCW",
                  "flipX",
                  "flipY",
                ],
                right: [ "download", "close"],
              },
            },
          }}
        >
          {" "}
          <a
            data-fancybox="photo"
            data-download-src={`${BASE_URL}uploads/products/${image}`}
            href={`${BASE_URL}uploads/products/${image}`}
          >
            <img
              src={`${BASE_URL}uploads/products/${image}`}
              alt={image}
            />
          </a>
        </Fancybox>
      </div>
      <div className="card--content">
        <div className="card--title title">{product_name}</div>
        <img
          src={`${BASE_URL}uploads/products/${image}`}
          alt={image}
          className="card--img--mobile"
        />
        <ul className="card--about">
          <li>
            <p>Yuklama</p>
            <h6>
              {overweight}
              <span>kg</span>
            </h6>
          </li>
          <li>
            <p>Kafolat</p>
            <h6>
              {guarantee}
              <span>yillik</span>
            </h6>
          </li>
          <li>
            <p>O'lchami</p>
            <h6>{size}</h6>
          </li>
          <li>
            <p>Sig'imi</p>
            <h6>
              {capacity}
              <span>kishilik</span>
            </h6>
          </li>
        </ul>
        <p className="card--text text">{description}</p>
        <p className="card--text text" style={{ marginBottom: "7px" }}>
          Narxi
        </p>
        <h6 className="card--price">
          {price}
          <span>so'm</span>
        </h6>
        <Button
          callback={() => orderControl(id)}
          title={"Buyurtma berish"}
          src={cart}
        />
      </div>
    </li>
  );
}

export default ProductCard;
