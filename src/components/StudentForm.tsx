"use client";

import { useState, useEffect } from "react";

interface Student {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  program: string;
  year_level: number;
  status: string;
}

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Student) => Promise<void>;
  isLoading?: boolean;
}

const programs = [
  "Informatique",
  "Mathématiques",
  "Physique",
  "Chimie",
  "Biologie",
  "Génie Civil",
  "Génie Électrique",
  "Économie",
  "Droit",
  "Médecine",
];

export default function StudentForm({
  student,
  onSubmit,
  isLoading,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Student>({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    program: "",
    year_level: 1,
    status: "active",
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year_level" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
            placeholder="Entrez le prénom"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
            placeholder="Entrez le nom"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
            placeholder="etudiant@email.com"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          >
            <option value="">Sélectionner</option>
            <option value="male">Masculin</option>
            <option value="female">Féminin</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
            placeholder="+212 XXXXXXXXX"
          />
        </div>

        {/* Program */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programme
          </label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          >
            <option value="">Sélectionner un programme</option>
            {programs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Year Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année d&apos;étude
          </label>
          <select
            name="year_level"
            value={formData.year_level}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          >
            {[1, 2, 3, 4, 5].map((y) => (
              <option key={y} value={y}>
                Année {y}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="graduated">Diplômé</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
          placeholder="Adresse complète"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Enregistrement..."
            : student
            ? "Mettre à jour"
            : "Ajouter l'étudiant"}
        </button>
      </div>
    </form>
  );
}
