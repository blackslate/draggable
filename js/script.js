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

  reset()

  detectMovement(event, 16)
  .then(() => startDrag(event))
  .catch(flashDiv)
}


// CUSTOM //


const reset = () => {
  clearTimeout(timeOut)
  dragMe.classList.remove("flash")
  dragMe.innerHTML = "Click me, hold me, drag me!"
}


const resetOnMouseUp = () => {
  clearTimeout(timeOut)
  const options = { once: true }
  document.body.addEventListener("mouseup", reset, options)
  document.body.addEventListener("touchend", reset, options)
}


const flashDiv = (text) => {
  dragMe.classList.add("flash")

  switch (text) {
    case "release": // one reason to reject promise of drag
      text = "We clicked."

      // ᐁᐁᐁ fall through to the setTimeout line ᐁᐁᐁ

    default: // (promise was resolved)
      timeOut = setTimeout(reset, 1000)
    break

    case "timeOut": // another reason to reject promise of drag
      resetOnMouseUp()
      text = "You pressed and held me : )"
  }

  dragMe.innerHTML = text
}



dragMe = document.getElementById("dragMe")
dragMe.addEventListener("mousedown", checkForDrag, false)
dragMe.addEventListener("touchstart", checkForDrag, false)

reset()