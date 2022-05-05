const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRegister = require("./models/userSchema");
const { registerValidation, loginValidation } = require("./validations.js");

exports.getAll = async (req, res) => {
  console.log("getAll-controller(req)", req.body);
  try {
    const users = await UserRegister.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await UserRegister.findOne({ _id: req.params.id });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTeam = async (req, res) => {
  console.log("getteam-controller(req)", req.body);
  try {
    const users = await UserRegister.find({ leadId: req.params.id });
    console.log("get-team-users", users);
    if (users.length <= 0) return res.status(400).send("No users in your team");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addUser = async (req, res) => {
  try {
    const User = await UserRegister.findOne({ _id: req.params.id });
    console.log("----adduser",User);
    if (User !== null) {
      console.log("aaa");
      const { error } = registerValidation(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      //check if user is already in database...
      const emailExist = await UserRegister.findOne({ email: req.body.email });
      if (emailExist !== null)
        return res.status(400).send("email already exist");

      // Hash password...
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const link = req.protocol + "://" + req.get("host");
      const imagePath = link + "/" + req.file.originalname;

      //new user...
      const user = new UserRegister({
        leadId: req.params.id,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        profile: imagePath,
        isAdmin: false,
      });

      await user.save();
      res.status(200).send("User added Succesfully");
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.uploadProfile = async (req, res) => {
  try {
    const link = req.protocol + "://" + req.get("host");
    const imagePath = link + "/" + req.file.originalname;

    // Updating user profile...
    await UserRegister.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { profile: imagePath } }
    );
    const user = await UserRegister.findOne({ _id: req.params.id });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createUser = async (req, res) => {
  //validation before saving user...
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is already in database...
    const emailExist = await UserRegister.findOne({ email: req.body.email });
    if (emailExist !== null) return res.status(400).send("email already exist");

    // Hash password...
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const link = req.protocol + "://" + req.get("host");
    const imagePath = link + "/" + req.file.originalname;

    //new user...
    const user = new UserRegister({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profile: imagePath,
      isAdmin: false,
    });

    await user.save();
    res.status(200).send("User Registred Succesfully");
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email is exiting.
    let user = await UserRegister.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email not found");

    // Checking the Password.
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid password");

    //create token
    const tokenKey = process.env.JWT_SECRET_KEY;
    console.log("Token_Key:--->>", tokenKey);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ _id: user._id, token: token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).send(error);
  }
};

//update user...
exports.updateUser = async (req, res) => {
  try {
    let newpassword;
    if (req.body.password === "") {
      const user = await UserRegister.findOne({ _id: req.params.id });
      newpassword = user.password;
    } else {
      //hashing new-password...
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      newpassword = hashedPassword;
    }
    // Updating user ...
    let user = await UserRegister.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { name: req.body.name, password: newpassword } }
    );
    user.save();
    res.status(200).send("user-updated successfully!!");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await UserRegister.findByIdAndDelete({ _id: req.body._id });
    console.log("---",user);
    if (!user) {
       return res.status(400).send("user not found");
    }
    else{
      let team = await UserRegister.deleteMany({
         leadId:req.body._id})
      if(!team) return res.status(200).send("no memebers found, deleted");

    }

    res.status(200).send("deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};
