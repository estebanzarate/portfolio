import { useState } from "react";
import useLanguage from "../hooks/useLanguage";

import HTBMachines from "../components/HTBMachines";
import HTBAcademy from "../components/HTBAcademy";
import HTBChallenges from "../components/HTBChallenges";
import HTBSherlocks from "../components/HTBSherlocks";
import THMRooms from "../components/THMRooms";

function Labs() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState("machines");

  const tabs = [
    {
      id: "machines",
      label: "Machines",
      component: HTBMachines,
    },
    {
      id: "academy",
      label: "Academy",
      component: HTBAcademy,
    },
    {
      id: "challenges",
      label: "Challenges",
      component: HTBChallenges,
    },
    {
      id: "sherlocks",
      label: "Sherlocks",
      component: HTBSherlocks,
    },
    {
      id: "thm",
      label: "TryHackMe",
      component: THMRooms,
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = currentTab.component;

  return (
    <section className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {lang === "es" ? "Laboratorios" : "Cybersecurity Labs"}
        </h1>

        <p className="text-secondary text-sm">
          {lang === "es"
            ? "Plataformas, laboratorios y desafíos de ciberseguridad."
            : "Cybersecurity platforms, labs and challenges."}
        </p>
      </div>

      {/* Mobile selector */}
      <div className="md:hidden mb-8">
        <label
          htmlFor="lab-category"
          className="block text-sm font-medium text-secondary mb-2"
        >
          {lang === "es" ? "Seleccionar categoría" : "Select category"}
        </label>

        <select
          id="lab-category"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full rounded-lg border border-surface2 bg-surface text-primary px-4 py-3 text-sm focus:outline-none focus:border-primary"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop tabs */}
      <div
        role="tablist"
        aria-label={
          lang === "es" ? "Categorías de laboratorios" : "Lab categories"
        }
        className="hidden md:flex gap-2 border-b border-surface2 mb-8 pb-2"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="lab-panel"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all border-b-2 ${
                isActive
                  ? "text-primary border-primary bg-primary/10"
                  : "text-secondary border-transparent hover:text-primary hover:bg-surface2/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="lab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="min-w-0"
      >
        <ActiveComponent />
      </div>
    </section>
  );
}

export default Labs;
