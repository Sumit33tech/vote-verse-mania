
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const AdminSchedule = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    options: [{ id: uuidv4(), text: "" }],
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      options: formData.options.map(option => 
        option.id === id ? { ...option, text: value } : option
      ),
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uuidv4(), text: "" }],
    });
  };

  const handleRemoveOption = (id: string) => {
    if (formData.options.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "At least one option is required.",
        variant: "destructive",
      });
      return;
    }

    setFormData({
      ...formData,
      options: formData.options.filter(option => option.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.options.some(option => !option.text.trim())) {
      toast({
        title: "Invalid options",
        description: "All options must have text.",
        variant: "destructive",
      });
      return;
    }

    const startTime = new Date(formData.startDate).getTime();
    const endTime = new Date(formData.endDate).getTime();
    
    if (startTime >= endTime) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we'd save this to a database
    console.log("Schedule voting:", formData);

    toast({
      title: "Voting Scheduled",
      description: "Your voting has been scheduled successfully!",
    });

    navigate("/admin/home");
  };

  return (
    <AdminLayout title="Schedule New Voting">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Voting Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for the voting"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date & Time</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Voting Options</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddOption}
            >
              <PlusCircle size={16} className="mr-1" />
              Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <Card key={option.id}>
                <CardContent className="p-3 flex items-center gap-2">
                  <span className="bg-votePurple text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-grow"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter an image URL for the voting"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-votePurple hover:bg-votePurple-secondary"
        >
          Schedule Voting
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminSchedule;
