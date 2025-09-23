import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Target, ArrowLeft } from 'lucide-react';

const AddGoal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('income_goals')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            target_amount: parseFloat(formData.targetAmount),
            current_amount: parseFloat(formData.currentAmount),
            target_date: formData.targetDate || null,
            status: formData.status,
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Income goal created successfully!',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Income Goal</h1>
          <p className="text-muted-foreground">Set a new financial target</p>
        </div>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Emergency Fund, Vacation Savings"
              />
            </div>

            <div>
              <Label htmlFor="targetAmount">Target Amount (₹)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                required
                placeholder="Enter target amount"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="currentAmount">Current Amount (₹)</Label>
              <Input
                id="currentAmount"
                name="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={handleChange}
                required
                placeholder="Enter current saved amount"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date (Optional)</Label>
              <Input
                id="targetDate"
                name="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Goal Tips */}
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg">💡 Goal Setting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Set realistic and achievable targets</li>
            <li>• Break large goals into smaller milestones</li>
            <li>• Regular contributions work better than lump sums</li>
            <li>• Review and adjust your goals periodically</li>
            <li>• Celebrate when you reach your targets!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddGoal;