const vehicles = [
  {
    brand: "Toyota",
    model: "Corolla",
    price: 20000,
    year: 2022,
    type: "Sedan",
    fuel: "Gasoline",
    transmission: "Automatic",
    mileage: 15000,
    status: "Used",
    image: "https://via.placeholder.com/150"
  },
  {
    brand: "Ford",
    model: "Explorer",
    price: 35000,
    year: 2023,
    type: "SUV",
    fuel: "Gasoline",
    transmission: "Automatic",
    mileage: 0,
    status: "New",
    image: "https://via.placeholder.com/150"
  }
];

function renderVehicles(list) {
  const container = document.getElementById("vehicle-list");
  container.innerHTML = "";

  list.forEach(v => {
    container.innerHTML += `
      <div class="card">
        <img src="${v.image}" width="100%">
        <h3>${v.brand} ${v.model}</h3>
        <p>Price: $${v.price}</p>
        <p>Year: ${v.year}</p>
        <p>Type: ${v.type}</p>
      </div>
    `;
  });
}

renderVehicles(vehicles);