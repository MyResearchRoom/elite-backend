import Category from "../modal/category.js";

export const createCategory = async (req, res) => {
  const { categoryName, categoryDescription } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  if (!categoryName || !categoryDescription || !req.file) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields" });
  }

  try {
    const category = new Category({
      categoryName,
      categoryDescription,
      categoryImage: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await category.save();

    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const data = await Category.find();
    const categories = data.map((category) => ({
      ...category,
      categoryImage: {
        contentType: category.categoryImage.contentType,
        data: category.categoryImage.data.toString("base64"),
      },
    }));

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName, categoryDescription } = req.body;
  const imageFile = req.file;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.categoryName = categoryName || category.categoryName;
    category.categoryDescription =
      categoryDescription || category.categoryDescription;
    if (imageFile) {
      category.categoryImage = {
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
      };
    }

    await category.save();

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    const category = await Category.findOneAndDelete({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.categoryImage = {
      data: category.categoryImage.data.toString("base64"),
      contentType: category.categoryImage.contentType,
    };

    res.status(200).json({ category });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
