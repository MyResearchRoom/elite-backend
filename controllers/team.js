import Team from "../modal/team.js";
import fs from "fs";

export const addTeamMember = async (req, res) => {
  const { name, designation, linkedInUrl } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  if (!name || !designation || !linkedInUrl || !req.file) {
    return res
      .status(400)
      .json({ message: "Please provide all necessary fields." });
  }

  try {
    const teamMember = new Team({
      name,
      designation,
      linkedInUrl,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await teamMember.save();

    res.status(201).json({ message: "Team member added successfully" });
  } catch (error) {
    console.log("Error creating tewam member");
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const data = await Team.find();
    const team = data?.map((team) => ({
      ...team,
      image: {
        contentType: team.image.contentType,
        data: team.image.data.toString("base64"),
      },
    }));
    res.status(200).json({ team });
  } catch (error) {
    console.error("Error getting team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editTeamMember = async (req, res) => {
  const editTeamMemberId = req.params.id;
  const { name, designation, linkedInUrl } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    let teamMember = await Team.findById(editTeamMemberId);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    teamMember.name = name || teamMember.name;
    teamMember.designation = designation || teamMember.designation;
    teamMember.linkedInUrl = linkedInUrl || teamMember.linkedInUrl;

    if (req.file) {
      teamMember.image = {
        type: req.file.mimetype,
        data: req.file.buffer,
      };
    }

    await teamMember.save();

    res.status(200).json({ message: "Team member updated successfully" });
  } catch (error) {
    console.error("Error editing team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTeamMember = async (req, res) => {
  const deleteTeamMemberId = req.params.id;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized request." });
  }

  try {
    const teamMember = await Team.findOneAndDelete({
      _id: deleteTeamMemberId,
    });

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamMember = async (req, res) => {
  const getTeamMemberId = req.params.id;

  try {
    let teamMember = await Team.findById(getTeamMemberId);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    teamMember = {
      ...teamMember,
      image: {
        contentType: teamMember.image.contentType,
        data: teamMember.image.data.toString("base64"),
      },
    };

    res.status(200).json({ teamMember });
  } catch (error) {
    console.error("Error getting team member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
