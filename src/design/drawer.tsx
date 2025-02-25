import * as React from "react";
import { LucideSettings, Minus, Plus } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Checkbox } from "../components/ui/checkbox";

export function SettingDrawer({
  translation,
  setTranslation,
  transliteration,
  setTransliteration,
}: any) {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <LucideSettings className="h-5 w-5" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Setting</DrawerTitle>
          </DrawerHeader>
          <div className="border-b border-b-gray-800"></div>
          <div className="p-4 pb-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-white">Word by word</h1>
              <div className="flex  items-center space-x-2">
                <Checkbox
                  className="bg-white"
                  onCheckedChange={() => setTranslation(!translation)}
                  id="terms"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Translation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-white"
                  onCheckedChange={() => setTransliteration(!transliteration)}
                  id="terms"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Transliteration
                </label>
              </div>
            </div>
            <div className="mt-3 h-[120px]">kkkkk</div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
