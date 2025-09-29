import csv from "csv-parser";
import { Readable } from "stream";

export const parseCSV = <T>(csvData: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const stream = Readable.from(csvData);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
