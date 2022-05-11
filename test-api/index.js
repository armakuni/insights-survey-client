const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const instanceId = Math.random().toString().substring(2);
const app = express();

app.use(cors());
app.use(bodyParser.json());

const memStore = [];

app.get("/surveys/:sid/submissions/:submissionId", (req, res) => {

    const { sid, submissionId } = req.params;
    const found = memStore.find(x => x.survey.id === sid && x.submission.id === submissionId);
    if(found)
        res.status(200).json(found);
    else
        res.status(404).json({ message: "Not found" });

});

app.post("/surveys/:sid/submissions", (req, res) => {

    const received = req.body;
    received.submission.id = `${instanceId}_${Date.now()}`;
    if(!("id" in received.survey))
        received.survey.id = req.params.sid;

    if (received.survey.id !== req.params.sid)
        sendClientErrorInvalidSurveyId(res);
    else {

        memStore.push(received);
        while(memStore.length > 5) {
            memStore.shift();
        }
        res.status(200).json(received);

    }

});

exports.surveys = app;

function sendClientErrorInvalidSurveyId(res) {
    res.status(400).json({
        "message": "Invalid survey id"
    });
}

