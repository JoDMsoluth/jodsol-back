import { Router } from "express";
import blogPostController from "./blogPostController";
import { checkObjectId } from "lib/middlewares/checkObjectId";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    // 서버쪽 디스크에 저장하겠다는 옵션
    destination(req, file, done) {
      done(null, "uploads/"); // uploads라는 폴더에 저장, null - 에러처리x
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자
      const basename = path.basename(file.originalname, ext); // 파일의 이름.확장자
      done(null, basename + new Date().valueOf() + ext); // 파일의 이름 + 업로드 시간을 추가해서 이름 중복 방지, null - 에러처리x
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 이하 20MB
});

const postApi = Router();

//read
postApi.get("/load/:id", checkObjectId, blogPostController.loadPost);
//imgUpload
postApi.post(
  "/thumbnail",
  upload.single("image"), // 프론트에서 정한 이름과 같아야됨
  blogPostController.uploadThumbnail
);
//images 1장 : single, => req.file 에 저장
//여러장 : array, => req.files 에 저장
//이름이 다 다르면 : fields, => req.files 에 저장
//파일이 없으면 : none
//write
postApi.post("/add/:category/:id", checkObjectId, blogPostController.addPost);
//delete
postApi.delete("/delete/:id", checkObjectId, blogPostController.deletePost);
//update
postApi.patch("/update/:id", checkObjectId, blogPostController.updatePost);
//like
postApi.patch("/like/:id", checkObjectId, blogPostController.likePost);
//unlike
postApi.patch("/unlike/:id", checkObjectId, blogPostController.unlikePost);

export default postApi;
