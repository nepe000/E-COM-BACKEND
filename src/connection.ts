import mongoose from "mongoose";
export const connectMongodb = (url: string) => {
  //?named export
  mongoose
    .connect(url)
    .then(() => console.log("database connected"))
    .catch((err: any) => console.log("error", err));
};
