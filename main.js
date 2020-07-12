const path = require('path')
const fs = require('fs')
const rd = require('rd')
const exec = require('child_process').exec
const { genImages } = require('./lib/makeImgs')
const { genVideo } = require('./lib/makeVideo')
const { createProjectDir, dateFormat } = require('./lib/utils')

const dir = '龙神古装潮图'
const title = dir
const desc = '最霸气的两张图，看完必下'

//  -------------

const source = './files/'
const dist = './project/'

const fileList = []
rd.eachFileFilterSync(path.resolve(__dirname, `${source}${dir}/`), /\.(jpg|png|jpeg|bmp)$/, function (f, s) {
  fileList.push(f)
})

function copyImg (dir) {
  const copyToDir = '/source'
  fs.mkdirSync(`${dir}${copyToDir}`)
  fileList.forEach(from => {
    const to = dir + copyToDir + '/' + path.basename(from)
    fs.copyFileSync(from, `${to}`)
  })
}

async function main (title, desc, list, date = dateFormat('mm-dd')) {
  const dir = createProjectDir(path.resolve(__dirname, `${dist}${title}_${date}`))
  const imgs = await genImages(title, desc, list, dir)
  const video = await genVideo(imgs, dir)
  console.log('log => : main -> video', video)
  exec(`open ${dir}`)
  copyImg(dir)
}

main(title, desc, fileList)
