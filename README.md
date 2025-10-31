/* GET all cart items */
router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



/* UPDATE quantity */
router.put("/:id", async (req, res) => {
  try {
    const { qty } = req.body;
    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    ).populate("productId");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* DELETE item */
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});