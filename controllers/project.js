import Project from "../modal/project.js";

export const createProject = async (req, res) => {
  const {
    category,
    location,
    date,
    heading,
    description,
    heading2,
    paragraphs,
  } = req.body;
  const files = req.files;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  if (!category || !heading || !description || !files.image[0]) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields" });
  }

  try {
    let images = [];
    if (files["images[]"]) {
      for (const file of files["images[]"]) {
        images.push({ data: file.buffer, contentType: file.mimetype });
      }
    }

    const project = new Project({
      category,
      location,
      date,
      heading,
      description,
      image: {
        data: files.image[0].buffer,
        contentType: files.image[0].mimetype,
      },
      heading2,
      paragraphs,
      images,
    });
    const saveProject = await project.save();

    res
      .status(201)
      .json({ message: "Project created successfully", saveProject });
  } catch (error) {
    console.error("Error creating project", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProject = async (req, res) => {
  const projectId = req.params.id;

  const {
    category,
    location,
    date,
    heading,
    description,
    heading2,
    paragraphs,
  } = req.body;
  const files = req.files;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.category = category || project.category;
    project.location = location || project.location;
    project.date = date || project.date;
    project.heading = heading || project.heading;
    project.description = description || project.description;
    project.heading2 = heading2 || project.heading2;
    project.paragraphs = paragraphs || project.paragraphs;

    if (files.image) {
      project.image =
        {
          data: files.image[0].buffer,
          contentType: files.image[0].mimetype,
        } || project.image;
    }

    if (files["images[]"]) {
      const images = [];
      let index = 0;
      for (const file of files["images[]"]) {
        if (file) {
          images.push({ data: file.buffer, contentType: file.mimetype });
        } else {
          images[index] = project.images[index];
        }
        index++;
      }
      project.images = images || project.images;
    }

    await project.save();
    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error editing project", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  const projectId = req.params.id;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    const project = await Project.findOneAndDelete({ _id: projectId });

    if (!project) {
      return res.status(400).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(400).json({ message: "Project not found." });
    }

    const mainImage = {
      data: project.image.data.toString("base64"),
      contentType: project.image.contentType,
    };

    const imagesData = project.images.map((image) => ({
      data: image.data.toString("base64"),
      contentType: image.contentType,
    }));

    project._doc.image = mainImage;
    project._doc.images = imagesData;

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error getting project", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const categoryName = req.body.id;

    let query = {};
    if (categoryName) {
      query = { category: categoryName };
    }

    const data = await Project.find(query);

    const projects = data.map((project) => {
      const mainImage = {
        data: project.image.data.toString("base64"),
        contentType: project.image.contentType,
      };

      const imagesData = project.images.map((image) => ({
        data: image.data.toString("base64"),
        contentType: image.contentType,
      }));

      return {
        ...project,
        image: mainImage,
        images: imagesData,
      };
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error getting projects", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
