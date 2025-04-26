// src/utils/csvLoader.js

export async function loadCSV(filePath, delimiter = ';') {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }

    const text = await response.text();
    const rows = text.split('\n');
    const headers = rows[0].split(delimiter);

    return rows
      .slice(1)
      .filter((row) => row.trim() !== '')
      .map((row) => {
        const values = row.split(delimiter);
        const obj = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
        });
        return obj;
      });
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}
