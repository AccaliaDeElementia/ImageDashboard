'use sanity'

const { promises: { readdir } } = require('fs')
const { extname, join } = require('path')

function hashit (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return hash
}

async function walkDirectory (root, eachDir, extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.tif', '.tiff', '.bmp', '.jpe']) {
  const queue = ['/']
  if (!eachDir) {
    eachDir = () => Promise.resolve()
  }
  while (queue.length > 0) {
    const current = queue.shift()
    const items = await readdir(join(root, current), {
      encoding: 'utf8',
      withFileTypes: true
    })
    queue.push(...items
      .filter(item => item.isDirectory() && item.name[0] !== '.')
      .map(item => join(current, item.name)))
    await eachDir(items
      .filter(item => !item.isDirectory() &&
        item.name[0] !== '.' &&
        extensions.includes(extname(item.name).toLowerCase()))
      .map(item => join(current, item.name))
      .filter(x => x), queue.length)
  }
}

let images = []

exports.syncImages = async () => {
  const results = []
  await walkDirectory('/data', async (items, pending) => {
    results.push(...items)
    console.log('pending items', pending)
  })
  results.sort((a, b) => {
    const hasha = hashit(a)
    const hashb = hashit(b)
    if (hasha === hashb) {
      return 0
    }
    return hasha < hashb ? -1 : 1
  })
  console.log('total images found: ', results.length)
  images = results
}

let index = 0
exports.randomImage = () => {
  index = Math.floor(Math.random() * images.length)
  return images[index]
}

exports.advanceImage = (increment = 1) => {
  index += increment
  while (index < 0) {
    index += images.length
  }
  index = index % images.length
  return images[index]
}

exports.currentImage = () => {
  return images[index]
}
