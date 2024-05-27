import Contact from "../modal/contact.js";

export const createContact = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, subject, message } =
    req.body;

  if (!firstName || !email || !phoneNumber || !subject || !message) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields" });
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    res
      .status(400)
      .json({ message: "Phone number must be 10 digits and only digits" });
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({ message: "Invalid email address" });
    return;
  }

  try {
    const contact = new Contact({
      firstName,
      lastName,
      email,
      phoneNumber,
      subject,
      message,
    });

    await contact.save();

    res.status(201).json({ message: "Contact created successfully" });
  } catch (error) {
    console.log("Error creating contact");
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getContacts = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request" });
  }
  try {
    const contacts = await Contact.find();
    const sortedContacts = contacts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedContacts = sortedContacts.reduce((acc, contact) => {
      const date = new Date(contact.createdAt).toISOString().split("T")[0]; // Get date part only
      acc[date] = acc[date] || [];
      acc[date].push(contact);
      return acc;
    }, {});

    res.status(200).json({ groupedContacts });
  } catch (error) {
    console.log("Error getting contacts");
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteContact = async (req, res) => {
  const deleteContactId = req.params.id;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const contact = await Contact.findOneAndDelete({ _id: deleteContactId });

    if (!contact) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error deleting contact");
    res.status(500).json({ message: "Internal server error." });
  }
};
