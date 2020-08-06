import { Request, Response } from "express";
import ViewsDocument from "../../../models/views/ViewsDocument";
import ViewsCollection from "../../../models/views/ViewsCollection";
import moment from "moment";

async function loadViews(req: Request, res: Response) {
  const nowDate = moment(Date.now()).format("YYYY-MM-DD");
  try {
    const getTotalViews:
      | ViewsDocument[]
      | null = await ViewsCollection.aggregate([
      {
        $group: {
          _id: { x: "x" },
          totalViews: { $sum: "$todayViews" },
        },
      },
      {
        $project: { _id: 0, totalViews: 1 },
      },
    ]).exec();
    const getTodayViews: ViewsDocument | null = await ViewsCollection.findOne({
      createAt: nowDate,
    })
      .select("todayViews")
      .exec();
    const views = { getTotalViews, getTodayViews };
    console.log(views);
    res.json(views);
  } catch (e) {
    console.error(e);
  }
}
async function addViews(req: Request, res: Response) {
  const nowDate = moment(Date.now()).format("YYYY-MM-DD");
  try {
    const addViews: ViewsDocument | null = await ViewsCollection.create({
      todayViews: 0,
      createAt: nowDate,
    });
    console.log(addViews);
    res.json(addViews);
  } catch (e) {
    console.error(e);
  }
}
const ViewsController = {
  loadViews,
  addViews,
};

export default ViewsController;
