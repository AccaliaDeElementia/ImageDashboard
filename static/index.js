'use sanity'

const cycleImage = () => {
  const path = `/image?${Date.now()}`
  Array.prototype.forEach.apply(document.images, [img => {
    img.src = path
  }])
}

document.body.addEventListener('click', cycleImage)
