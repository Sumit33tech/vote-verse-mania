
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

interface VotingOption {
  id: string;
  text: string;
  imageUrl?: string;
}

const AdminSchedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    options: [{ id: uuidv4(), text: "", imageUrl: "" }] as VotingOption[],
    imageUrl: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch voting data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchVotingData = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('voting_schedules')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Convert database format to form format
            setFormData({
              title: data.title,
              startDate: new Date(data.start_date).toISOString().slice(0, 16),
              endDate: new Date(data.end_date).toISOString().slice(0, 16),
              options: Array.isArray(data.options) ? 
                data.options.map((opt: any) => ({
                  id: opt.id,
                  text: opt.text,
                  imageUrl: opt.imageUrl || ""
                })) : 
                [{ id: uuidv4(), text: "", imageUrl: "" }],
              imageUrl: data.image_url || "",
            });
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: "Failed to load voting data: " + error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchVotingData();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (id: string, field: keyof VotingOption, value: string) => {
    setFormData({
      ...formData,
      options: formData.options.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      ),
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uuidv4(), text: "", imageUrl: "" }],
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      setIsLoading(true);
      
      // Cast options to Json type to satisfy TypeScript
      const optionsJson = formData.options as unknown as Json[];

      if (isEditMode) {
        // Update existing record
        const updateData = {
          title: formData.title,
          start_date: formData.startDate,
          end_date: formData.endDate,
          options: optionsJson,
          image_url: formData.imageUrl || null,
          created_by: user?.id
        };
        
        const result = await supabase
          .from('voting_schedules')
          .update(updateData)
          .eq('id', id);
          
        if (result.error) throw result.error;
      } else {
        // Generate a unique code for the voting
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Insert new record
        const insertData = {
          code: code,
          title: formData.title,
          start_date: formData.startDate,
          end_date: formData.endDate,
          options: optionsJson,
          image_url: formData.imageUrl || null,
          created_by: user?.id
        };
        
        const result = await supabase
          .from('voting_schedules')
          .insert(insertData);

        if (result.error) throw result.error;
      }

      toast({
        title: isEditMode ? "Voting Updated" : "Voting Scheduled",
        description: isEditMode 
          ? "Your voting has been updated successfully!" 
          : "Your voting has been scheduled successfully!",
      });

      // Navigate to admin home with replace: true to prevent going back
      navigate("/admin/home", { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule voting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title={isEditMode ? "Edit Voting Schedule" : "Schedule New Voting"}>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
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
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-votePurple text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-grow space-y-2">
                        <Input
                          value={option.text}
                          onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-grow"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            value={option.imageUrl}
                            onChange={(e) => handleOptionChange(option.id, 'imageUrl', e.target.value)}
                            placeholder="Image URL (optional)"
                            className="flex-grow"
                          />
                          <Image className="text-gray-400" size={20} />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(option.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-votePurple hover:bg-votePurple-secondary"
            disabled={isLoading}
          >
            {isEditMode ? "Update Voting" : "Schedule Voting"}
          </Button>
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminSchedule;
