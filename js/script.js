////// DRAG UTILITIES /// ///DRAG UTILITIES ////// DRAG UTILITIES //////
// https://gist.github.com/blackslate/6f77d3acd2edc2a286cff6d607cf3ce8

const getPageXY = (event) => {
  if (event.targetTouches && event.targetTouches.length) {
    event = event.targetTouches[0] || {}
  }

  return { x: event.pageX, y: event.pageY }
}


const getXY = (event, frame) => {
  if (["client", "page", "offset"].indexOf(frame) < 0) {
    frame = "client"
  }
  if (event.targetTouches && event.targetTouches.length) {
    event = event.targetTouches[0] || {}
  }

  return { x: event[frame + "X"], y: event[frame + "Y"] }
}


/**
 * Returns a promise which will be:
 * * resolved if the mouse or touch moves more than triggerDelta
 *   pixels in any direction
 * * rejected if the mouse is released or the touch gesture ends before
 *   moving that far, or if <timeOut> number of milliseconds elapses
 *   before any movement occurs.
 *
 * @param  {event}  event should be a mousedown or touchstart event
 * @param  {number} triggerDelta should be a positive number of pixels
 * @param  {number} timeOut may be a number of milliseconds. Defaults
 *                          to 150. Use 0 for no timeOut rejection.
 *
 * @return  {promise}
 */
const detectMovement = (event, triggerDelta, timeOut) => {
  const trigger2 = triggerDelta * triggerDelta
  timeOut = isNaN(timeOut) ? 150 : Math.abs(timeOut)

  function movementDetected(resolve, reject) {
    const { x: startX, y: startY } = getPageXY(event)
    const options = { event, drag, drop }
    const cancel = setTrackedEvents(options)
    // { actions: { move: <"touchmove" | "mousemove">
    //              end:  <"toucheend" | "mouseup">
    // , drag: function
    // , drop: function
    // }

    // Check if the mouse/touch has moved more than triggerDelta
    // pixels in any direction, and resolve promise if so.
    function drag(event) {
      const { x, y } = getPageXY(event)
      const deltaX = startX - x
      const deltaY = startY - y
      const delta2 = (deltaX * deltaX + deltaY * deltaY)

      if (delta2 > trigger2) {
        setTrackedEvents(cancel)
        resolve()
      }
    }

    // Reject promise if the mouse is released before the mouse/touch
    // moved triggerDelta pixels in any direction.
    function drop() {
      setTrackedEvents(cancel)
      reject()
    }

    if (timeOut) {
      setTimeout(drop, timeOut)
    }
  }

  return new Promise(movementDetected)
}


// The prevent default function needs to be outside setTrackedEvents
// so that the exact same function (rather than a duplicate)
const noDefault = (event) => event.preventDefault()


const setTrackedEvents = ({ actions, event, drag, drop }) => {
  // Omit event to cancel tracking
  const body = document.body

  const dragOption = { passive: false } // capture is false by default

  if (event) {
    if (typeof actions !== "object") {
      actions = {}
    }

    if (event.type === "touchstart") {
      actions.move  = "touchmove"
      actions.end   = "touchend"
    } else {
      actions.move  = "mousemove"
      actions.end   = "mouseup"
    }

    body.addEventListener(actions.move, drag, false)
    body.addEventListener(actions.end, drop, false)
    // Prevent the page scrolling during drag, or touch devices
    document.addEventListener("touchstart", noDefault, dragOption)

  } else {
    body.removeEventListener(actions.move, drag, false)
    body.removeEventListener(actions.end, drop, false)
    // Restore page scrolling on touche devices now that drag is over
    document.removeEventListener("touchstart", noDefault)
  }

  return { actions, drag, drop }
}


/// CUSTOM DRAG //// CUSTOM DRAG //// CUSTOM DRAG //// CUSTOM DRAG ////

let dragMe
  , offset
  , cancelTracking


const drag = (event) => {
  const { x, y } = getPageXY(event)

  dragMe.style.left = (offset.x + x )+ "px"
  dragMe.style.top =  (offset.y + y )+ "px"
}


const drop = () => {
  setTrackedEvents(cancelTracking)
  dragMe.style = {}
  flashDiv()
}


const startDrag = (event) => {
  event.preventDefault()
  // event.stopPropagation()

  const { x, y } = getPageXY(event)

  const { left, top } = dragMe.getBoundingClientRect()
  offset = { x: left - x, y: top - y }

  const options = {
    event
  , drag
  , drop
  }

  cancelTracking = setTrackedEvents(options)
}


const checkForDrag = (event) => {
  detectMovement(event, 16)
  .then(
    () => startDrag(event)
   )
  .catch(flashDiv)
}


// CUSTOM //


const flashDiv = () => {
  dragMe.classList.add("flash")
  setTimeout(() => dragMe.classList.remove("flash"), 1000)
}


dragMe = document.getElementById("dragMe")
dragMe.addEventListener("mousedown", checkForDrag, false)
dragMe.addEventListener("touchstart", checkForDrag, false)
