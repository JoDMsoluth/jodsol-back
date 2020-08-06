import schedule from "node-schedule";
import moment from "moment";
import ViewsCollection from "../models/views/ViewsCollection";

export default function initializeViews(): void {
  schedule.scheduleJob("59 59 23 * * 0-7", async () => {
    const nowDate = moment(Date.now() + 1000).format("YYYY-MM-DD");
    await ViewsCollection.create({
      todayViews: 0,
      createAt: nowDate,
    });
  });
}
