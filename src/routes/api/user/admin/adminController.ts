import { Request, Response } from "express";
import bcrypt from "bcryptjs";

async function login(req: Request, res: Response) {
  const adminPassword = await bcrypt.hash(
    String(process.env.ADMIN_PASSWORD),
    12
  );
  const match = await bcrypt.compare(req.body.password, adminPassword);

  if (match && req.body.id === process.env.ADMIN_ID) {
    const day: number = 60 * 60 * 24 * 1000;
    res.cookie("adlgck", true, {
      maxAge: day,
      expires: new Date(Date.now() + day)
    });
    res.status(200).json("success");
  } else {
    res.json("fail");
  }
}

const AdminController = {
  login
};

export default AdminController;
