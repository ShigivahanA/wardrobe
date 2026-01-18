import archiver from 'archiver'
import fetch from 'node-fetch'
import { PassThrough } from 'stream'

import User from '../models/User.js'
import WardrobeItem from '../models/WardrobeItem.js'
import Outfit from '../models/Outfit.js'
import { exportDataEmail } from './emailTemplates.js'
import { sendEmail } from './mailer.js'
import { pdfToBuffer } from './pdf.js'

export const exportUserDataAndEmail = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return

  /* ======================
     Fetch data
  ====================== */
  const wardrobe = await WardrobeItem.find({ userId }).lean()
  const outfits = await Outfit.find({ userId })
    .populate('items.top items.bottom items.footwear')
    .lean()

  const profile = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }

  /* ======================
     ZIP stream
  ====================== */
  const zipStream = new PassThrough()
  const archive = archiver('zip', { zlib: { level: 9 } })

  archive.pipe(zipStream)

  /* ======================
     JSON files
  ====================== */
  archive.append(JSON.stringify(profile, null, 2), { name: 'profile.json' })
  archive.append(JSON.stringify(wardrobe, null, 2), { name: 'wardrobe.json' })
  archive.append(JSON.stringify(outfits, null, 2), { name: 'outfits.json' })

  /* ======================
     PDFs
  ====================== */
  archive.append(
    await pdfToBuffer(doc => {
      doc.fontSize(16).text('Profile').moveDown()
      doc.fontSize(12)
      doc.text(`Name: ${profile.name}`)
      doc.text(`Email: ${profile.email}`)
      doc.text(`Joined: ${profile.createdAt}`)
    }),
    { name: 'profile.pdf' }
  )

  archive.append(
    await pdfToBuffer(doc => {
      doc.fontSize(16).text('Wardrobe').moveDown()
      wardrobe.forEach(item => {
        doc.moveDown().fontSize(12)
        doc.text(`Category: ${item.category}`)
        doc.text(`Brand: ${item.brand || '-'}`)
        doc.text(`Size: ${item.size || '-'}`)
        doc.text(`Colors: ${(item.colors || []).join(', ')}`)
      })
    }),
    { name: 'wardrobe.pdf' }
  )

  archive.append(
    await pdfToBuffer(doc => {
      doc.fontSize(16).text('Outfits').moveDown()
      outfits.forEach(o => {
        doc.moveDown().fontSize(12)
        doc.text(`Occasion: ${o.occasion || '-'}`)
        doc.text(`Wear count: ${o.wearCount}`)
        doc.text(`Last worn: ${o.lastWornAt}`)
      })
    }),
    { name: 'outfits.pdf' }
  )

  /* ======================
     Images (streamed)
  ====================== */
  for (const item of wardrobe) {
    if (!item.imageUrl) continue

    const res = await fetch(item.imageUrl)
    archive.append(res.body, {
      name: `images/${item._id}.jpg`
    })
  }

  await archive.finalize()

  /* ======================
     Email
  ====================== */
const email = exportDataEmail(user.name)

await sendEmail({
  to: user.email,
  subject: email.subject,
  text: email.text,
  html: email.html,
  attachments: [
    {
      filename: 'wardrobe-export.zip',
      content: zipStream
    }
  ]
})
}
