import { Application, Request, Response } from "express";
import auth from "./router/router";
import fs from "fs";
import path from "path";
import lodash, { some } from "lodash";

export const mainApp = (app: Application) => {
  app.use("/api", auth);

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(202).json({
        message: "Awesome API",
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error",
      });
    }
  });

  app.get("/read", (req: Request, res: Response) => {
    try {
      const myPath = path.join(__dirname, "data", "./database.json");
      fs.readFile(
        myPath,
        (err: Error | NodeJS.ErrnoException | null, resp: Buffer) => {
          if (err) {
            return err.message;
          } else {
            const result = JSON.parse(Buffer.from(resp).toString());

            return res.status(200).json({
              message: "Displaying data form the database",
              data: result,
            });
          }
        }
      );
    } catch (error) {
      return res.status(404).json({
        message: "Error",
        data: error,
      });
    }
  });

  app.post("/data", (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        const myPath = path.join(__dirname, "data", "database.json");

        fs.readFile(
          myPath,
          (err: NodeJS.ErrnoException | null, resp: Buffer) => {
            if (err) {  
               console.error(err);
               return res.status(500).json({ error: err.message });
            }
            // else {
              const file = JSON.parse(Buffer.from(resp).toString());

              const check = some(file, data);

              if (check) {
                return res.status(200).json({
                  message: `Reading from ${data} category`,
                  data: file,
                });
              } else {
                file.push(data);

                fs.writeFile(myPath, JSON.stringify(file), () => {
                  console.log("completed");
                });
              }
              return res.status(201).json({
                message: `Created ${data} category successfully`,
                data: file,
              });
          }
        // }
      );
    } catch (error: any) {
      console.log(error.message);
      return res.status(404).json({
        message: "Error",
      });
    }
  });
};
