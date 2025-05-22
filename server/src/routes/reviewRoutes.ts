import express, { Request, Response, Router } from 'express';
import Review from '../models/Review';
import { analyzeSentiment } from '../utils/sentimentAnalyzer';
import { promises } from 'dns';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, rating, comment]
 *             properties:
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/:productId/reviews', async (req: Request<{ productId: string }>, res: Response):Promise<any> => {
  try {
    const { productId } = req.params;
    const { author, rating, comment } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ message: 'Author, rating, and comment are required' });
    }

    const lastReview = await Review.findOne().sort({ id: -1 });
    const newId = lastReview ? lastReview.id + 1 : 1;
    const sentiment = await analyzeSentiment(comment);

    const review = new Review({
      id: newId,
      productId: parseInt(productId),
      author,
      rating: parseInt(rating),
      comment,
      sentiment,
      date: new Date(),
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

/**
 * @swagger
 * /products/{productId}/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, rating, comment]
 *             properties:
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put('/:productId/:reviewId', async (req: Request<{ productId: string; reviewId: string }>, res: Response):Promise<any> => {
  try {
    const { productId, reviewId } = req.params;
    const { author, rating, comment } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ message: 'Author, rating, and comment are required' });
    }

    const sentiment = await analyzeSentiment(comment);

    const updatedReview = await Review.findOneAndUpdate(
      { productId: parseInt(productId), id: parseInt(reviewId) },
      {
        author,
        rating: parseInt(rating),
        comment,
        sentiment,
        date: new Date(),
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review updated successfully', updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of reviews
 *       404:
 *         description: No reviews found
 *       500:
 *         description: Server error
 */
router.get('/:productId/reviews', async (req: Request<{ productId: string }>, res: Response):Promise<any> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId: parseInt(productId) });
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

/**
 * @swagger
 * /products/{productId}/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete('/:productId/:reviewId', async (req: Request<{ productId: string; reviewId: string }>, res: Response):Promise<any> => {
  try {
    const { productId, reviewId } = req.params;

    if (!productId || !reviewId) {
      return res.status(400).json({ message: 'Product ID and Review ID are required' });
    }

    const deletedReview = await Review.findOneAndDelete({
      productId: parseInt(productId),
      id: parseInt(reviewId),
    });

    if (deletedReview) {
      res.json({ message: 'Review deleted successfully', deletedReview });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;
