import axios from "axios";

export type DvlaVehicle = {
  registrationNumber?: string;
  make?: string;
  yearOfManufacture?: number;
  engineCapacity?: number;
  fuelType?: string;
  colour?: string;
};

export async function fetchVehicleFromDvla(registrationNumber: string) {
  if (!process.env.DVLA_API_KEY || !process.env.DVLA_API_URL) {
    return {
      registrationNumber,
      make: "Demo",
      yearOfManufacture: 2020,
      engineCapacity: 1968,
      fuelType: "DIESEL",
      colour: "GREY"
    } satisfies DvlaVehicle;
  }

  const response = await axios.post<DvlaVehicle>(
    process.env.DVLA_API_URL,
    { registrationNumber },
    { headers: { "x-api-key": process.env.DVLA_API_KEY } }
  );
  return response.data;
}
