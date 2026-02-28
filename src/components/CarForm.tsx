"use client";

import { useState, useEffect } from "react";

interface Car {
  id?: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  price: number | string;
  doors: number;
  horsepower: number | string;
  description: string;
  status: string;
}

interface CarFormProps {
  car?: Car;
  onSubmit: (data: Car) => Promise<void>;
  isLoading?: boolean;
}

const brands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda",
  "Hyundai", "Kia", "Mercedes-Benz", "Nissan", "Opel", "Peugeot",
  "Renault", "Seat", "Škoda", "Toyota", "Volkswagen", "Volvo",
];

const colors = [
  { value: "noir", label: "Noir" },
  { value: "blanc", label: "Blanc" },
  { value: "gris", label: "Gris" },
  { value: "rouge", label: "Rouge" },
  { value: "bleu", label: "Bleu" },
  { value: "vert", label: "Vert" },
  { value: "jaune", label: "Jaune" },
  { value: "orange", label: "Orange" },
  { value: "marron", label: "Marron" },
  { value: "argent", label: "Argent" },
];

export default function CarForm({ car, onSubmit, isLoading }: CarFormProps) {
  const [formData, setFormData] = useState<Car>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    license_plate: "",
    mileage: 0,
    fuel_type: "essence",
    transmission: "manuelle",
    price: "",
    doors: 4,
    horsepower: "",
    description: "",
    status: "disponible",
  });

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "mileage" || name === "doors"
          ? parseInt(value) || 0
          : name === "price" || name === "horsepower"
          ? value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Marque <span className="text-orange-500">*</span>
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="">Sélectionner une marque</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Modèle <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
            placeholder="Ex: Clio, Golf, 308..."
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Année <span className="text-orange-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min={1990}
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Couleur
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="">Sélectionner</option>
            {colors.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* License Plate */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Plaque d&apos;immatriculation
          </label>
          <input
            type="text"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500 uppercase"
            placeholder="AB-123-CD"
          />
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Kilométrage
          </label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          />
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Carburant
          </label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="hybride">Hybride</option>
            <option value="electrique">Électrique</option>
            <option value="gpl">GPL</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Transmission
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="manuelle">Manuelle</option>
            <option value="automatique">Automatique</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Prix (€)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            step={100}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
            placeholder="15000"
          />
        </div>

        {/* Doors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Portes
          </label>
          <select
            name="doors"
            value={formData.doors}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            {[2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>{d} portes</option>
            ))}
          </select>
        </div>

        {/* Horsepower */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Puissance (CV)
          </label>
          <input
            type="number"
            name="horsepower"
            value={formData.horsepower}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
            placeholder="110"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white"
          >
            <option value="disponible">Disponible</option>
            <option value="vendu">Vendu</option>
            <option value="reserve">Réservé</option>
            <option value="maintenance">En maintenance</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition text-white placeholder-gray-500"
          placeholder="Description de la voiture..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Enregistrement..."
            : car
            ? "Mettre à jour"
            : "Ajouter la voiture"}
        </button>
      </div>
    </form>
  );
}
