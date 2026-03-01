function CarCard({ brand, model, price, year }) {
  return (
    <div className="car-card">
      <p className="car-card-title">{brand} {model}</p>
      <p className="car-card-meta">Årsmodell {year}</p>
      <p className="car-card-price">{price?.toLocaleString('sv-SE')} kr</p>
    </div>
  )
}

export default CarCard
