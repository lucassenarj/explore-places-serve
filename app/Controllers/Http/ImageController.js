'use strict'

const Image = use('App/Models/Image')
const Property = use('App/Models/Property')
const Helpers = use('Helpers')

class ImageController {
  /**
   * * Create/save a new image
   * POST images
   */
  async store ({ request }) {
    const property = await Property.findOrFail(params.id)

    const images = request.file('image', {
      type: ['image'],
      size: '2mb'
    })

    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.moveAll()) {
      return images.errors()
    }

    await Promisse.all(
      images.movedList().map(image => property.images().create({ path: images.fileName }))
    )
  }
}

module.exports = ImageController
