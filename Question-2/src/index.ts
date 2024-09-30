import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import lockfile from "proper-lockfile";
const app = express();
const PORT = 3000;

interface RoomServices {
  id: number;
  guestName: string;
  roomNumber: number;
  requestDetails: string;
  priority: number; // - lower numbers indicate higher priority
  status:
    | "received"
    | "in progress"
    | "awaiting confirmation"
    | "completed"
    | "canceled";
}

app.use(express.json());

const filePath = path.join(__dirname, "requests.json");

const readDataFromFile = async (): Promise<RoomServices[]> => {
  const release = await lockfile.lock(filePath);
  try {
    const data = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "[]";
    return JSON.parse(data);
  } catch (err) {
    throw new Error("Cannot read from the file");
  } finally {
    await release();
  }
};

const writeDataToFile = async (data: RoomServices[]): Promise<void> => {
  const release = await lockfile.lock(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to file:", err);
  } finally {
    await release();
  }
};

// Getting all room service requests
app.get("/requests", async (req, res) => {
  const requests = await readDataFromFile();
  const sortedRequests = requests.sort((a, b) => a.priority - b.priority);
  console.log("triggered get all requests");
  res.status(200).json(sortedRequests);
});

// Creating a room service request
app.post("/requests", async (req, res) => {
  const data = req.body;
  if (
    !data.guestName ||
    !data.priority ||
    !data.roomNumber ||
    !data.requestDetails
  ) {
    res.status(400).json({ error: "Please provide all the required details" });
  }

  const getAll = await readDataFromFile();

  const newRequest: RoomServices = {
    id: getAll.length + 1,
    guestName: data.guestName,
    priority: data.priority,
    roomNumber: data.roomNumber,
    requestDetails: data.requestDetails,
    status: "received",
  };

  console.log("triggered post request");

  const requests = await readDataFromFile();
  requests.push(newRequest);

  await writeDataToFile(requests);
  res.status(200).json(newRequest);
});

// Getting a request by specific ID
app.get("/requests/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id is ", id);
  const requests = await readDataFromFile();
  console.log("requests are", requests)
  const request = requests.find((request) => request.id === parseInt(id));

  console.log("request is ", request);
  if (!request) {
    res.status(400).json({ error: "Room Service Request not found" });
  }
  res.status(200).json(request);
});

// Updating a request by specific ID
app.put("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const requests = await readDataFromFile();
  const index = requests.findIndex((request) => request.id === parseInt(id));
  const request = requests[index];

  if (!request) {
    res.status(400).json({ error: "Room Service request not found" });
  } else {
    const updatedRequest: RoomServices = {
      id: parseInt(id),
      guestName: data.guestName ?? request.guestName,
      roomNumber: data.roomNumber ?? request.roomNumber,
      priority: data.priority ?? request.priority,
      requestDetails: data.requestDetails ?? request.requestDetails,
      status: request.status,
    };
    requests[index] = updatedRequest;
    await writeDataToFile(requests);
    res.status(200).json(updatedRequest);
  }
});

// Marking a request as completed by specific ID
app.post("/requests/:id/complete", async (req, res) => {
  const { id } = req.params;
  const requests = await readDataFromFile();
  const index = requests.findIndex((request) => request.id === parseInt(id));
  const request = requests[index];

  if (!request) {
    res.status(400).json({ error: "Room Service request not found" });
  } else {
    request.status = "completed";
    requests[index] = request;
    await writeDataToFile(requests);
    res.status(200).json(request);
  }
});

// Deleting a request by specific ID
app.delete("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const requests = await readDataFromFile();
  const deleteRequestIndex = requests.findIndex((r) => r.id === parseInt(id));

  if (deleteRequestIndex === -1) {
    res.status(400).json({ error: "Request not found" });
  }

  requests.splice(deleteRequestIndex, 1);
  await writeDataToFile(requests);
  res.status(200).send("Deleted successfully");
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
