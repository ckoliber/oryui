import { Express } from "express";

import { kratos } from "../app/ory";

export default (app: Express) => {
    app.get("/error", async (req, res, next) => {
        const id = req.query.id;

        if (!id) {
            return res.redirect("/");
        }

        try {
            const { data } = await kratos.getSelfServiceError(String(id));

            res.status(500).render("error", {
                message: JSON.stringify(data.error, null, 2),
            });
        } catch (err) {
            next(err);
        }
    });
};
