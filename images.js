'use sanity'

const { promises: { readdir } } = require('fs')
const { extname, join } = require('path')

const chunks = (arr, size = 200) => {
  const res = []
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }
  return res
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

exports.syncImages = async () => {
  const db = await require('./db').initialize
  await db('syncitems').truncate()
  await walkDirectory('/data', async (items, pending) => {
    for (const chunk of chunks(items)) {
      await db('syncitems').insert(chunk.map(image => {
        return {
          image
        }
      }))
    }
    console.log('pending items', pending)
  })
  await db('images').insert(function () {
    this.select('syncitems.image').from('syncitems')
      .leftJoin('images', 'images.image', 'syncitems.image')
      .andWhere({
        'images.image': null
      })
  })
  await db('images').whereNotExists(function () {
    this.select('*').from('syncitems').whereRaw('syncitems.image = images.image')
  }).delete()
  const count = (await db('images').count('*'))[0]['count(*)']
  console.log('total images found: ', count)
}
