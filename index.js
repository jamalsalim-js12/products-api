import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
app.use(express.json());
const PORT = 4000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "API documentation for managing products",
    },
    servers: [
      {
        url: "https://btl-products-api.onrender.com/",
      },
    ],
  },
  apis: ["./index.js"], // Update if your routes are in a different file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const products = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
    category: "beauty",
    price: 9.99,
    rating: 2.56,
    brand: "Essence",
    image:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description:
      "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks.",
    category: "beauty",
    price: 19.99,
    rating: 2.86,
    brand: "Glamour Beauty",
    image:
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
  },
  {
    id: 3,
    title: "Powder Canister",
    description:
      "The Powder Canister is a finely milled setting powder designed to set makeup and control shine.",
    category: "beauty",
    price: 14.99,
    rating: 4.64,
    brand: "Velvet Touch",
    image:
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
  },
  {
    id: 4,
    title: "Calvin Klein CK One",
    description:
      "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent.",
    category: "fragrances",
    price: 49.99,
    rating: 4.37,
    brand: "Calvin Klein",
    image:
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
  },
  {
    id: 5,
    title: "Annibale Colombo Bed",
    description:
      "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials.",
    category: "furniture",
    price: 1899.99,
    rating: 4.77,
    brand: "Annibale Colombo",
    image:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
  },
];

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product added successfully
 */
app.post("/products", (req, res) => {
  const { title, description, category, price, rating, brand, image } =
    req.body;
  if (!title || !description || !brand || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newProduct = {
    id: generateId(),
    title,
    description,
    brand,
    category,
    rating,
    price,
    image,
  };
  products.push(newProduct);
  res.json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deletedProduct = products.splice(index, 1)[0];
  res.json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - brand
 *         - price
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         rating:
 *           type: number
 *         brand:
 *           type: string
 *         image:
 *           type: string
 */
