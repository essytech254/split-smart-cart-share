
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Users, Calculator, Crown } from "lucide-react";
import { ShoppingItem, HouseholdMember } from "@/types/shopping";
import AddMemberDialog from "@/components/AddMemberDialog";
import AddItemDialog from "@/components/AddItemDialog";
import ShoppingListItem from "@/components/ShoppingListItem";
import CostSplitter from "@/components/CostSplitter";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('shoppingMembers');
    const savedItems = localStorage.getItem('shoppingItems');
    
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('shoppingMembers', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }, [items]);

  const addMember = (memberData: Omit<HouseholdMember, 'id'>) => {
    const newMember: HouseholdMember = {
      ...memberData,
      id: Date.now().toString()
    };
    setMembers([...members, newMember]);
    toast({
      title: "Member added",
      description: `${memberData.name} has been added to the household.`,
    });
  };

  const addItem = (itemData: Omit<ShoppingItem, 'id' | 'purchased'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: Date.now().toString(),
      purchased: false
    };
    setItems([...items, newItem]);
    toast({
      title: "Item added",
      description: `${itemData.name} has been added to the shopping list.`,
    });
  };

  const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    
    if (updates.purchased) {
      toast({
        title: "Item purchased",
        description: "Item marked as purchased and added to cost calculation.",
      });
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from the shopping list.",
    });
  };

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  const totalActual = items.filter(item => item.purchased).reduce((sum, item) => sum + (item.actualPrice || item.estimatedPrice), 0);
  const itemsLeft = items.filter(item => !item.purchased).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">SplitCart</h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Smart shopping lists with automatic cost splitting
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Crown className="h-3 w-3 mr-1" />
              Premium Features
            </Badge>
            <span className="text-sm text-gray-500">KES 100/month per household</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {members.length}
              </div>
              <div className="text-sm text-gray-600">Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {items.length}
              </div>
              <div className="text-sm text-gray-600">Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {itemsLeft}
              </div>
              <div className="text-sm text-gray-600">To Buy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                KES {totalEstimated.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Estimated</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="shopping" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shopping" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Shopping List
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2">
              <Calculator className="h-4 w-4" />
              Cost Split
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shopping" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shopping List</CardTitle>
                  <div className="flex gap-2">
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-500">Add members first</p>
                    ) : (
                      <AddItemDialog onAddItem={addItem} members={members} />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                    <p className="text-gray-500 mb-4">Add your first shopping item to get started!</p>
                    {members.length === 0 && (
                      <p className="text-sm text-orange-600">Add household members first</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <ShoppingListItem
                        key={item.id}
                        item={item}
                        members={members}
                        onUpdateItem={updateItem}
                        onDeleteItem={deleteItem}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Household Members</CardTitle>
                  <AddMemberDialog onAddMember={addMember} />
                </div>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                    <p className="text-gray-500 mb-4">Add household members to start sharing costs!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <Card key={member.id} className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: member.color }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-500">Member</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            {members.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cost data</h3>
                  <p className="text-gray-500">Add members and start shopping to see cost breakdowns!</p>
                </CardContent>
              </Card>
            ) : (
              <CostSplitter items={items} members={members} />
            )}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            💡 <strong>Coming Soon:</strong> Real-time sync, store integrations, and budgeting tools
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>🏠 Perfect for families & roommates</span>
            <span>📱 Mobile-first design</span>
            <span>💰 Smart cost splitting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
