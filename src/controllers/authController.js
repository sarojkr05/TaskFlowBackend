import User from "../schemas/userSchema.js";

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const { name, email, password } = req.body;

    // Find user in DB
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user
    await user.save();

   // Convert Mongoose document to plain object & remove password
   const updatedUser = user.toObject();
   delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
