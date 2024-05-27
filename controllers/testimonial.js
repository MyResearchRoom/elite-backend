import Testimonial from "../modal/testimonial.js";

export const createTestimonial = async (req, res) => {
  const { name, organization, designation, description } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  if (!name || !organization || !designation || !req.file) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields" });
  }

  try {
    const testimonial = new Testimonial({
      name,
      organization,
      designation,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      description,
    });

    const savedTestimonial = await testimonial.save();

    res
      .status(200)
      .json({ message: "Testimonial created successfully", savedTestimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find();
    const testimonials = data?.map((testimonial) => ({
      ...testimonial,
      image: {
        contentType: testimonial.image.contentType,
        data: testimonial.image.data.toString("base64"),
      },
    }));
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editTestimonial = async (req, res) => {
  const testimonialId = req.params.id;
  const { name, organization, designation, description } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    let testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    testimonial.name = name || testimonial.name;
    testimonial.organization = organization || testimonial.organization;
    testimonial.designation = designation || testimonial.designation;
    testimonial.description = description || testimonial.description;

    if (req.file) {
      testimonial.image = {
        type: req.file.mimetype,
        data: req.file.buffer,
      };
    }

    await testimonial.save();

    res.status(200).json({ message: "Testmonial updated successfully" });
  } catch (error) {
    console.error("Error editing testimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTestimonial = async (req, res) => {
  const testimonialId = req.params.id;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    const testimonial = await Testimonial.findOneAndDelete({
      _id: testimonialId,
    });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testmonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTestimonial = async (req, res) => {
  const testimonialId = req.params.id;

  try {
    let testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    testimonial = {
      ...testimonial,
      image: {
        contentType: testimonial.image.contentType,
        data: testimonial.image.data.toString("base64"),
      },
    };

    res.status(200).json({ testimonial });
  } catch (error) {
    console.error("Error getting testimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
