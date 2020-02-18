import mongoose, { Model, Schema } from "mongoose";
import ProjectPostDocument from "./ProjectPostDocument";

export const ProjectPostSchema: Schema = new Schema(
  {
    coverImg: String,
    title: String,
    desc: String,
    markdown: String,
    category: String
  },
  { timestamps: true }
);

const ProjectPostCollection: Model<ProjectPostDocument> = mongoose.model(
  "ProjectPost",
  ProjectPostSchema
);

export default ProjectPostCollection;
