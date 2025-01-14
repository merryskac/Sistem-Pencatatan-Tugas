import user from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcyrpt, { hash } from "bcrypt";

// register function
const register = async (req, res) => {
  const { email, password, name, gender } = req.body;
  const salt = bcyrpt.genSaltSync();
  const hashPassword = bcyrpt.hashSync(password, salt);
  try {
    // If email Already in database
    const userExist = await user.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (userExist[0])
      return res.status(409).json({
        message: "Email Already Used",
      });

    // email never used
    await user.create({
      email: email,
      name: name,
      password: hashPassword,
      gender: gender,
      profile_img: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    });
    res.json({
      message: "User Create Success",
    });
  } catch (error) {
    res.json({ error });
  }
};

// login
const login = async (req, res) => {
  try {
    const userExist = await user.findAll({
      where: {
        email: req.body.email,
      },
    });

    if (!userExist[0])
      return res.status(400).json({
        status: 400,
        message: "Email Not Found",
      });

    const { id, name, email } = userExist[0];

    const match = await bcyrpt.compare(
      req.body.password,
      userExist[0].password
    );
    if (!match)
      return res.status(400).json({
        status: 400,
        message: "Wrong Password",
      });

    const accessToken = jwt.sign(
      { id, name, email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { id, name, email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    await user.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      status: 200,
      message: "Login Berhasil",
      id: userExist[0].id,

      name: userExist[0].name,
      token: accessToken,
    });

  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  const token = req.cookies.token;
  if (!token) res.sendStatus(403);

  res.clearCookie("token");
  return res.sendStatus(200);
};

const testMiddleware = (req, res) => {
  console.log("Midlleware");
};

const getUserProfile = (req, res) => {
  console.log(req.id);
  try {
    user
      .findAll({
        where: {
          id: req.id,
        },
        attributes: ["id", "email", "name", "gender", "profile_img"],
      })
      .then((result) => {
        res.status(200).json({ result });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export { register, login, testMiddleware, logout, getUserProfile };
