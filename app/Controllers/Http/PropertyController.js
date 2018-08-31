'use strict'

const Property = use('App/Models/Property')
const Image = use('App/Models/Image')

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   */
  async index () {
    const properties = await Property.all()

    return properties
  }

  /**
   * Create/save a new property.
   * POST properties
   */
  async store ({ request, response }) {
    const data = request.only([
      "user_id",
      "title",
      "address",
      "price",
      "latitude",
      "longitude"
    ])

    let arrImages = request.only([
      "images",
      "images.*.property_id",
      "images.*.path"
    ])

    try {
      const property = await Property.create(data)
  
      const createdImages = await arrImages.images.map((items) => {
        Image.create(property.id, items.path)
      })
      
      return createdImages
    } catch (error) {
      return response.status(401).send({error: error})
    }
  }

  /**
   * Display a single property.
   * GET properties/:id
   */
  async show ({ params }) {
    const property = await Property.findOrFail(params.id)

    await property.load('images')

    return property
  }

  /**
   * Update property details.
   * PUT or PATCH properties/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   */
  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id)

    if (property.user_id !== auth.user.id) {
      return response.status(401).send({error: 'Not authorized'})
    }

    await property.delete()
  }
}

module.exports = PropertyController
