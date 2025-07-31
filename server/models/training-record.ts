// This would eventually map to a PostgreSQL table using Drizzle ORM

export interface TrainingRecord {
  id: string;
  course: string;
  date: string; // ISO string or Date type
  instructor: string;
  employees: string[]; // array of employee IDs or names
  standard: string; // e.g. '1926.503'
  documentUrl: string; // link to uploaded file in storage
  status?: "pending" | "approved";
  createdAt: string;
}

// Example function (placeholder for DB insert)
export function saveTrainingRecord(record: TrainingRecord) {
  console.log("Saving training record:", record);
  // Replace this with Drizzle ORM logic to persist to DB
}