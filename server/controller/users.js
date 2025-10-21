const User=require("../models/users");


const getAllUsers=async(req,res)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById=async(req,res)=>{
    try{
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
}
module.exports={getAllUsers,getUserById};