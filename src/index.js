const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCol = document.querySelector('#toy-collection')
let addToy = false
let allToys = []
// YOUR CODE HERE


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!
fetch('http://localhost:3000/toys')
  .then(r => r.json())
  .then(toys => {
    allToys = toys
    for (const toy of toys) {
      toyCol.innerHTML += `
      <div class="card" data-id=${toy.id}>
        <h2>${toy.name}</h2>
        <img src=${toy.image} class="toy-avatar" />
        <p id="numLikes">${toy.likes} Likes </p>
        <button class="like-btn" data-action="like">Like <3</button>
      </div>
      `
    }
  })

toyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const toyName = toyForm.querySelector("#nameField").value;
  const toyURL = toyForm.querySelector("#toyUrl").value;
  const data = {
    name: toyName,
    image: toyURL,
    likes: 0
  }

  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(toy => {
      toyCol.innerHTML += `
      <div class="card" data-id=${toy.id}>
        <h2>${toy.name}</h2>
        <img src=${toy.image} class="toy-avatar" />
        <p id="numLikes">${toy.likes} Likes </p>
        <button class="like-btn" data-action="like">Like <3</button>
      </div>
      `
    })
})

toyCol.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'like') {
    let toyID = e.target.parentElement.dataset.id
    const foundToy = allToys.find(toy => toy.id === parseInt(toyID))
    const numOfLikes = e.target.previousElementSibling
    const toyName = foundToy.name
    const toyURL = foundToy.image
    let toyLikes = foundToy.likes
    toyLikes++
    numOfLikes.innerHTML = `${toyLikes} Likes`
    const data = {
      id: parseInt(toyID),
      name: toyName,
      image: toyURL,
      likes: toyLikes
    }
    fetch(`http://localhost:3000/toys/${toyID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data)
      })
      .then(r => r.json())
      .then(toy => {
        allToys = allToys.map(toy => {
          if (toy.id === parseInt(toyID)) {
            return data
          } else {
            return toy
          }
        })
      })
  }

})
