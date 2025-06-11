import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { clsx } from "clsx";

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  className?: string;
}

const Tabs = ({ tabs, className }: TabsProps) => {
  return (
    <Tab.Group>
      <Tab.List className={clsx("flex space-x-4 border-b", className)}>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              clsx(
                "py-2 px-4 border-b-2 text-sm font-medium leading-5",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                selected
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.label}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export { Tabs };
