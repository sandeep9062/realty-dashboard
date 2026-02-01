"use client";

import { useState } from "react";
import { updateProperty } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageIcon, X, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  description: string;
  images?: string[];
}

interface EditPropertyFormProps {
  property: Property;
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  const [description, setDescription] = useState(property.description);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [images, setImages] = useState<string[]>(property.images || []);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProperty} className="space-y-6">
            <input type="hidden" name="id" value={property.id} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input name="title" id="title" defaultValue={property.title} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input name="location" id="location" defaultValue={property.location} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input name="price" id="price" type="number" defaultValue={property.price} required />
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
                rows={6} 
                required 
                className="resize-none"
              />
            </div>

            {/* Media Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="media">Property Images & Videos</Label>
              <div className="space-y-4">
                {/* Media Previews */}
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

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Property
              </Button>
              <Button variant="outline" type="button" asChild>
                <a href="/dashboard/properties">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}