const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }))
}


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create a product
 * @param {object} req 
 * @param {object} res 
 */
async function createProduct(req, res) {
  const product = await Products.create(req.body)
  res.json(product)
}

/**
 * Edit a product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */

async function edit (_id, change) {
  const product = await get(_id)

  // todo can we use spread operators here?
  Object.keys(change).forEach(function (key) {
    product[key] = change[key]
  })
  
  await product.save()

  return product
}

/**
 * Delete a product
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function destroy (_id) {
  return await Product.deleteOne({_id})
}
async function createOrder (req, res, next) {
  const order = await Orders.create(req.body)
  res.json(orders)
}

/**
 * List orders
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}
async function editOrder(req, res, next) {
  try {
    const order = await Orders.edit(req.params.id, req.body)
    res.json(order)
  } catch (err) {
    next(err)
  }
}

/**
 * Delete an order
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function deleteOrder(req, res, next) {
  try {
    await Orders.destroy(req.params.id)
    res.status(204).send() // No content
  } catch (err) {
    next(err)
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  createOrder,
  editOrder,
  deleteOrder
});
