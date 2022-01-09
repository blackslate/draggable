/// CUSTOM DRAG //// CUSTOM DRAG //// CUSTOM DRAG //// CUSTOM DRAG ////

let dragMe
  , cancelTracking
  , timeOut


const drop = () => {
  dragMe.style = {}
  flashDiv("You dragged me!")
}


const startDrag = (event) => {
  reset()
  dragMe.innerHTML = "Wheeee!"

  const options = {
    event
  , drop
  }

  cancelTracking = startTracking(options)
}


const checkForDrag = (event) => {
  event.preventDefault()

  dragMe.innerHTML = "Drag me!"

  detectMovement(event, 16)
  .then(() => startDrag(event))
  .catch(flashDiv)
}


// CUSTOM //


const reset = () => {
  clearTimeout(timeOut)
  dragMe.classList.remove("flash")
  dragMe.innerHTML = "Drag me!"
}


const flashDiv = (text) => {
  dragMe.classList.add("flash")

  if (text === "timeOut") { // called by reject
    clearTimeout(timeOut)
    const options = { once: true }
    document.body.addEventListener("mouseup", reset, options)
    document.body.addEventListener("touchend", reset, options)

  } else {
    timeOut = setTimeout(reset, 1000)
  }

  dragMe.innerHTML = text
}



dragMe = document.getElementById("dragMe")
dragMe.addEventListener("mousedown", checkForDrag, false)
dragMe.addEventListener("touchstart", checkForDrag, false)
