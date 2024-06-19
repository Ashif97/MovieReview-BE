const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
