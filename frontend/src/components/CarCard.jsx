function CarCard({ brand, model, price, year }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "12px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h3>{brand} {model}</h3>
      <p>Year: {year}</p>
      <p>Price: {price} kr</p>
    </div>
  );
}

export default CarCard;