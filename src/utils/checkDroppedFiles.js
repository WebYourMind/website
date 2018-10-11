const acceptedFilesValues = ['application/json']

const checkDroppedFiles = files => {
  let acceptedFiles = []
  let rejectedFiles = []

  files.forEach(file => {
    const acceptedType = acceptedFilesValues.find(el => el === file.type)

    if (acceptedType) acceptedFiles.push(file)
    else rejectedFiles.push(file)
  })

  return {
    acceptedFiles,
    rejectedFiles
  }
}

export default checkDroppedFiles
