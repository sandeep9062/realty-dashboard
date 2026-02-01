"use client"; // Required for state and fetch

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createProperty } from "@/lib/actions";
import { Wand2, Loader2, ImageIcon, X } from "lucide-react"; // Icons for AI feel
import { toast } from "sonner";

export default function NewPropertyPage() {
  const [description, setDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error(`${file.name} is not an image or video file`);
        return false;
      }
      if (file.size > 25 * 1024 * 1024) { // 25MB limit for videos
        toast.error(`${file.name} is too large (max 25MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append("media", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.fileUrls) {
        setImages(prev => [...prev, ...data.fileUrls]);
        toast.success(`Uploaded ${data.fileUrls.length} file(s)`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to upload files");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAiOptimize = async () => {
    if (!description || description.length < 10) {
      toast.error("Please enter a short description first.");
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (data.optimizedText) {
        setDescription(data.optimizedText);
        toast.success("Description optimized by AI!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("AI optimization failed. Please try again.");
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="shadow-2xl border-none bg-white">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-2xl font-bold text-slate-900">Add New Property</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={createProperty} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input name="title" id="title" placeholder="e.g. Modern 3BHK Apartment" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input name="location" id="location" placeholder="e.g. Sector 17, Chandigarh" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input name="price" id="price" type="number" placeholder="5000000" required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                {/* AI Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAiOptimize}
                  disabled={isOptimizing}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-2"
                >
                  {isOptimizing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  {isOptimizing ? "Optimizing..." : "AI Optimize"}
                </Button>
              </div>
              <Textarea 
                name="description" 
                id="description" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter basic details and click 'AI Optimize' to polish..." 
                rows={6} 
                required 
                className="resize-none"
              />
            </div>

            {/* Media Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="media">Property Images & Videos</Label>
              <div className="space-y-4">
                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                          <video
                            src={url}
                            controls
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Property media ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Input */}
                <div className="flex items-center gap-4">
                  <Input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Media"}
                  </Button>
                </div>

                {/* Hidden Input to pass media to form */}
                {images.map((url, index) => (
                  <input
                    key={index}
                    type="hidden"
                    name="images"
                    value={url}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-11">
                Publish Property
              </Button>
              <Button variant="outline" type="button" asChild className="h-11">
                <a href="/dashboard/properties">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
