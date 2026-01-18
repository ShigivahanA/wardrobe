import PDFDocument from 'pdfkit'

export const pdfToBuffer = (writer) =>
  new Promise(resolve => {
    const doc = new PDFDocument({ margin: 40 })
    const chunks = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    writer(doc)
    doc.end()
  })
