import express from "express";
import path from "path";
import fs from "fs";

import { renderFile } from "eta";

import { i18n } from "./i18n";

export const app = express();

app.engine("eta", renderFile);
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "eta");

app.use(require("morgan")("tiny"));
app.use(require("cookie-parser")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.use(i18n.init);

app.get("/health", (_, res) => res.send("ok"));

for (const file of fs.readdirSync(path.join(__dirname, "..", "routes"))) {
    require(path.join(__dirname, "..", "routes", file)).default(app);
}

app.get("*", (req, res) => {
    res.status(404).render("error", {
        message: "The requested page could not be found (404).",
    });
});
app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).render("error", {
        message: JSON.stringify(err, null, 2),
    });
});
