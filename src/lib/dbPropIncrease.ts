import BlogPostCollection from "../models/blogPost/BlogPostCollection";
import BlogPostDocument from "../models/blogPost/BlogPostDocument";

export default async function dbPropIncrease(
  id: string,
  props: string,
  value: number
) {
  try {
    const newPost: BlogPostDocument | null = await BlogPostCollection.findByIdAndUpdate(
      id,
      {
        $inc: { [props]: value },
      },
      { new: true }
    ).exec(); // new:true => 업데이트 된 데이터 반환

    if (!newPost) {
      console.log("not found");
    }
    return newPost && newPost.likes;
  } catch (e) {
    console.error(e);
    return;
  }
}
