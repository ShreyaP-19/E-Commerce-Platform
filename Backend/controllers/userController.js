// controllers/userController.js
export const getUserProfile = (req, res) => {
  res.json(req.user); // You have access to the user info here
};
