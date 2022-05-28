import { Express } from "express";

import { kratos } from "../app/ory";

export default (app: Express) => {
    app.get("/login", async (req, res, next) => {
        const flow = req.query.flow;

        if (!flow) {
            const params = new URLSearchParams(req.query as any);

            return res.redirect(
                `http://localhost:4433/self-service/login/browser?${params.toString()}`
            );
        }

        try {
            const { data } = await kratos.getSelfServiceLoginFlow(
                String(flow),
                req.headers.cookie
            );

            res.render("login", {
                ui: data.ui,
            });
        } catch (err) {
            next(err);
        }
    });
};
