
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { ShoppingItem, HouseholdMember } from "@/types/shopping";

interface ShoppingListItemProps {
  item: ShoppingItem;
  members: HouseholdMember[];
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (id: string) => void;
}

export default function ShoppingListItem({ item, members, onUpdateItem, onDeleteItem }: ShoppingListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(item.actualPrice || item.estimatedPrice);

  const addedByMember = members.find(m => m.id === item.addedBy);
  const purchasedByMember = members.find(m => m.id === item.purchasedBy);

  const handlePurchaseToggle = (checked: boolean) => {
    if (checked) {
      onUpdateItem(item.id, { 
        purchased: true, 
        actualPrice: editedPrice,
        purchasedBy: addedByMember?.id || item.addedBy
      });
    } else {
      onUpdateItem(item.id, { 
        purchased: false, 
        actualPrice: undefined,
        purchasedBy: undefined
      });
    }
  };

  const handlePriceUpdate = () => {
    onUpdateItem(item.id, { actualPrice: editedPrice });
    setIsEditing(false);
  };

  return (
    <Card className={`p-4 transition-all ${item.purchased ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={item.purchased}
          onCheckedChange={handlePurchaseToggle}
          className="data-[state=checked]:bg-green-600"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${item.purchased ? 'line-through text-gray-500' : ''}`}>
              {item.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Qty: {item.quantity}</span>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(parseFloat(e.target.value) || 0)}
                    className="w-20 h-6 text-xs"
                    step="0.01"
                  />
                  <Button size="sm" variant="ghost" onClick={handlePriceUpdate} className="h-6 w-6 p-0">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    KES {item.actualPrice?.toFixed(2) || item.estimatedPrice.toFixed(2)}
                  </span>
                  {!item.purchased && (
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-6 w-6 p-0">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {addedByMember && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: addedByMember.color }}
                />
                <span className="text-xs">by {addedByMember.name}</span>
              </div>
            )}
          </div>
          
          {item.purchased && purchasedByMember && (
            <div className="text-xs text-green-600 mt-1">
              ✓ Purchased by {purchasedByMember.name}
            </div>
          )}
        </div>
        
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onDeleteItem(item.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
