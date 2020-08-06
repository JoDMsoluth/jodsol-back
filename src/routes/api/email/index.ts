import { Router, Request, Response } from "express";
import { sendEmail } from "../../../configs/smtp";
const postApi = Router();

//post
postApi.post("/send", (req: Request, res: Response) => {
  const { name, from, subject, content } = req.body;

  try {
    sendEmail(name, from, subject, content);
    res.json({ name, from, subject, content });
  } catch (e) {
    res.json("fail");
  }
});

export default postApi;
