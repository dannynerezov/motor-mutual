import suzukiAlto from "@/assets/vehicles/2013-suzuki-alto.jpg";
import hyundaiAccent from "@/assets/vehicles/2017-hyundai-accent.jpg";
import kiaSportage from "@/assets/vehicles/2020-kia-sportage.jpg";
import toyotaCamry from "@/assets/vehicles/2017-toyota-camry.jpg";
import nissanXTrail from "@/assets/vehicles/2021-nissan-xtrail.jpg";
import toyotaKluger from "@/assets/vehicles/2019-toyota-kluger.jpg";
import bmwX4 from "@/assets/vehicles/2019-bmw-x4.jpg";
import mercedesE43 from "@/assets/vehicles/2018-mercedes-e43.jpg";
import bmw430i from "@/assets/vehicles/2021-bmw-430i.jpg";

export interface VehicleExample {
  id: number;
  year: number;
  make: string;
  model: string;
  value: number;
  image: string;
  description: string;
}

export const vehicleExamples: VehicleExample[] = [
  {
    id: 1,
    year: 2013,
    make: "Suzuki",
    model: "Alto GLX",
    value: 3499,
    image: suzukiAlto,
    description: "Perfect entry-level city car for rideshare drivers"
  },
  {
    id: 2,
    year: 2017,
    make: "Hyundai",
    model: "Accent Sport",
    value: 8990,
    image: hyundaiAccent,
    description: "Reliable and economical daily driver"
  },
  {
    id: 3,
    year: 2020,
    make: "Kia",
    model: "Sportage",
    value: 14900,
    image: kiaSportage,
    description: "Comfortable SUV for longer trips"
  },
  {
    id: 4,
    year: 2017,
    make: "Toyota",
    model: "Camry Altise Hybrid",
    value: 22999,
    image: toyotaCamry,
    description: "Fuel-efficient hybrid for smart operators"
  },
  {
    id: 5,
    year: 2021,
    make: "Nissan",
    model: "X-Trail TS 4X4",
    value: 28990,
    image: nissanXTrail,
    description: "Spacious and versatile family SUV"
  },
  {
    id: 6,
    year: 2019,
    make: "Toyota",
    model: "Kluger",
    value: 34990,
    image: toyotaKluger,
    description: "Premium family SUV with excellent safety"
  },
  {
    id: 7,
    year: 2019,
    make: "BMW",
    model: "X4 xDrive20i",
    value: 49990,
    image: bmwX4,
    description: "Luxury performance SUV"
  },
  {
    id: 8,
    year: 2018,
    make: "Mercedes-Benz",
    model: "E 43 AMG",
    value: 51900,
    image: mercedesE43,
    description: "High-performance luxury sedan"
  },
  {
    id: 9,
    year: 2021,
    make: "BMW",
    model: "430i M Sport",
    value: 61900,
    image: bmw430i,
    description: "Premium coupe with sporting character"
  }
];
