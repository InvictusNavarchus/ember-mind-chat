
import React, { useState } from "react";
import { Settings, Moon, Sun, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatStore } from "../store/chatStore";

const SettingsDialog: React.FC = () => {
  const { modelSettings, updateModelSettings, darkMode, setDarkMode } = useChatStore();
  const [localSettings, setLocalSettings] = useState({ ...modelSettings });
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    updateModelSettings(localSettings);
    setOpen(false);
  };
  
  const handleSliderChange = (key: keyof typeof localSettings, value: number[]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSwitchChange = (key: keyof typeof localSettings, checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: checked }));
  };
  
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="model">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="model" className="py-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature: {localSettings.temperature.toFixed(1)}</Label>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[localSettings.temperature]}
                  onValueChange={(value) => handleSliderChange("temperature", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values make responses more focused and deterministic. Higher values make responses more creative and varied.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="topP">Top P: {localSettings.topP.toFixed(1)}</Label>
                </div>
                <Slider
                  id="topP"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[localSettings.topP]}
                  onValueChange={(value) => handleSliderChange("topP", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Controls diversity via nucleus sampling. Lower values make the output more focused.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxTokens">Max Tokens: {localSettings.maxTokens}</Label>
                </div>
                <Slider
                  id="maxTokens"
                  min={100}
                  max={2000}
                  step={100}
                  value={[localSettings.maxTokens]}
                  onValueChange={(value) => handleSliderChange("maxTokens", value)}
                />
                <p className="text-xs text-muted-foreground">
                  The maximum number of tokens to generate in the response.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="useHistory"
                  checked={localSettings.useHistory}
                  onCheckedChange={(checked) => handleSwitchChange("useHistory", checked)}
                />
                <Label htmlFor="useHistory">Use conversation history</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, the model will consider previous messages in the conversation for context.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="py-4 space-y-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleDarkModeToggle}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Switch between dark and light mode.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="py-4 space-y-4">
            <div className="flex items-center gap-2">
              <Info size={18} className="text-mindmeld-primary" />
              <h3 className="text-lg font-medium">About MindMeld</h3>
            </div>
            <p className="text-sm">
              MindMeld is a browser-based AI assistant that runs entirely on your device using TensorFlow.js. No data is sent to external servers - all processing happens locally in your browser.
            </p>
            <h4 className="font-medium text-sm mt-4">Key Features:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>100% browser-based AI using TensorFlow.js</li>
              <li>Complete privacy - no data leaves your device</li>
              <li>Conversation history saved locally</li>
              <li>Customizable model settings</li>
              <li>Dark and light mode</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Version 1.0.0
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
