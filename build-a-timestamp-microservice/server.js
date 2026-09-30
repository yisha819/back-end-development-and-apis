import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

function handleDate(req, res) {
  const { date: dateParam } = req.params;
  let parsedDate;

  //task 1: date empty, return current time
  if (!dateParam) {
    parsedDate = new Date();
  }

  //task 2: date number, return unix timestamp
  else if(/^\d+$/.test(dateParam)) {
    parsedDate = new Date(parseInt(dateParam, 10));
  }

  //task 3: standard date string
  else {
    parsedDate = new Date(dateParam);
  }

  //task 4: date validation
  if (isNaN(parsedDate.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  //task 5: return JSON response
  return res.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });

}; 

app.get("/api", handleDate);
app.get("/api/:date", handleDate);

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
