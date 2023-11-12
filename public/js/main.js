const roomImage = document.querySelector("#room-image")
const imageContainer = document.querySelector("#image-container")
const chooseImageContainer = document.querySelector("#choose-image-container")
const showRoomImage = document.querySelector("#show-room-image")

function main() {
  roomImage.addEventListener("change", (e) => {
    showRoomImage.src = URL.createObjectURL(e.target.files[0])
    chooseImageContainer.classList.add("hidden")
    imageContainer.classList.remove("hidden")
  })
}

main()
