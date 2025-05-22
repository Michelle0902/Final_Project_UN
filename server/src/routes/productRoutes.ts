import express from 'express';
import Product from '../models/Product';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category filter
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term (name/category)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of matching products
 */


/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */

router.get('/', async (req, res) => {
  try {
    const { page = 1, category } = req.query;
    const limit = 10;
    const query = category ? { category } : {};

    const products = await Product.find(query)
      .sort({ dateAdded: -1 })
      .skip((+page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: +page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filter products by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Filtered product list
 */

router.get('/filter', async (req, res) : Promise<any>=> {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error('❌ Error filtering by category:', error);
    res.status(500).json({ message: 'Error filtering products by category' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const q = req.query.q as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    console.log(' Search query:', q);
    console.log(' Page:', page);

    const searchQuery = {
      name: { $regex: q, $options: 'i' }
    };

    const products = await Product.find(searchQuery)
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(searchQuery);

    console.log('✅ Products found:', products.length);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (error) {
    console.error('❌ Error in /search:', error);  
    res.status(500).json({ message: 'Error fetching product' });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const parsedId = parseInt(productId);
    if (isNaN(parsedId)) {
       res.status(400).json({ message: 'Invalid product ID' });
       return;
    }
    const product = await Product.findOne({ id: parsedId });
    if (!product) {
       res.status(404).json({ message: 'Product not found' });
       return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create a new product
router.post('/', async (req, res): Promise<any> => {
  try {
    const { name, description, category, price } = req.body;

   const errors: Record<string, string> = {};
    if (!name || !name.trim()) errors.name = 'Name is required';
    if (!description || !description.trim()) errors.description = 'Description is required';
    if (!category || !category.trim()) errors.category = 'Category is required';
    if (!price || isNaN(price)) errors.price = 'Price must be a number';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existing = await Product.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Product with this name already exists' });
    }

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id: newId,
      name,
      description,
      category,
      price,
      dateAdded: new Date(),
      averageRating: 0,
    });

    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Error creating product' });
  }
});

router.put('/:productId', async (req, res): Promise<any> => {
  try {
    const { productId } = req.params;
    const { name, description, category, price } = req.body;

    if (!name || !description || !category || price == null) {
       return res.status(400).json({ message: 'All fields are required' });
    }

    const updated = await Product.findOneAndUpdate(
      { id: parseInt(productId) },
      { name, description, category, price },
      { new: true }
    );

    if (!updated) {res.status(404).json({ message: 'Product not found' });} 

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

export default router;
